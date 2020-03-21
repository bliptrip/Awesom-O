/**************************************************************************************
This file is part of Awesom-O, an image acquisition and analysis web application,
consisting of a frontend web interface and a backend database, camera, and motor access
management framework.

Copyright (C)  2020  Andrew F. Maule

Awesom-O is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Awesom-O is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this Awesom-O.  If not, see <https://www.gnu.org/licenses/>.
**************************************************************************************/

import {controllerSetRunningStatus,
        CONTROLLER_RUNNING_STATUS_RUNNING,
        CONTROLLER_RUNNING_STATUS_PAUSED,
        CONTROLLER_RUNNING_STATUS_STOPPED,
        CONTROLLER_SET_LOCATION,
        controllerSetLocation} from '../../../frontend/src/actions';
import {snapShot} from './camera';

const auth           = require('../../lib/passport').auth;
import {wss} from '../../lib/websocket';
const mongoose       = require('mongoose');
const pauseable      = require('pauseable'); //Allows pausing/resuming of timers
const router         = require('express').Router();
const SerialPort     = require('serialport');
const Readline       = require('@serialport/parser-readline')

const Projects       = mongoose.model('Projects');
const Users          = mongoose.model('Users');

const TIMEOUT_INFINITE = 0;
const ROUTE_INDEX_START = -1; /* Indicates taht we need to go 'home' */
const SLEEP_INT   = 100; //sleep time in milliseconds between sending subcommands on serial port
const STEPS_PER_CM = 9804; //motor steps per cm
const DEFAULT_SERIAL = "/dev/ttyS0";
const HOME_TIMEOUT = 30000;
const MOVE_TIMEOUT = 15000;


//Global state for storing the serial port information
var port = undefined;
var parser = undefined;
//Global state for tracking controller run state, current project running, current route index
var current_project = undefined;
var current_user = undefined;
var current_project_timer = undefined;
var current_route_index;
var current_location = {row: 0, col: 0}; //Assume at home at init
var current_state = CONTROLLER_RUNNING_STATUS_STOPPED; //The current state of the controller
var current_motor_states = ["READY", "READY"];

const openPort = (path) => {
    let lport = new SerialPort(path, {
                          baudRate: 9600,
                          parity: 'none',
                          dataBits: 8,
                          stopBits: 1,
                          autoOpen: false
                         });

    lport.open(function(err) {
        if (err) {
            return console.log('Error opening port: ', err.message);
        }
    });

    let lparser = lport.pipe(new Readline({delimiter: '\r'}));
    lparser.on('data', (data) => {
        let match;
        if( match = data.match(/^([12])RS=(.+)/) ) { //M status character indicates motors in motion
            let axis = Number(match[1]);
            if( match[2].match(/M/) )
                current_motor_states[axis-1] = "MOVING";
            else
                current_motor_states[axis-1] = "READY";
        } 
    });

    return({port: lport, parser: lparser});
}

const closePort = () => {
    const p = new Promise( resolve => {
        port.close( resolve );
    });
    return p;
}

const sleep = (ms) => {
    const p = new Promise(resolve => setTimeout(resolve, ms));
    p.then( () => {} );
}

const sendCommand = (command) => {
    port.write(command + "\r");
}

const sendCommandStop = () => {
    sendCommand('SK');
}

//Status character codes:
//A = An Alarm code is present (use AL command to see code, AR command to clear code)
//D = Disabled (the drive is disabled)
//E = Drive Fault (drive must be reset by AR command to clear this fault)
//F = Motor moving
//H = Homing (SH in progress)
//J = Jogging (CJ in progress)
//M = Motion in progress (Feed & Jog Commands)
//P = In position
//R = Ready (Drive is enabled and ready)
//S = Stopping a motion (ST or SK command executing)
//T = Wait Time (WT command executing)
//W = Wait Input (WI command executing)
//
//NOTE: Send RS will return 2RS=R^M1RS=R^M if the drive is ready
//If the drive is in motion, will get RS=MPR^M
//If the drives have hit the end-stops, then 2RS=AR^M1RS=AR^M, and AL=0002^M2AL=0002^M
//NOTE: AR command will not clear the end-stop flag, as it will continue to trip until motors move away from end-stop
//switch.
//NOTE: SK can be used to stop/kill motors immediately.
//To configure serial port to raw mode in linux: sudo stty -F /dev/ttyS0 -echo -echoe -echok raw 9600
//To read from serial port: cat -v < /dev/ttyS0
//To write to serial port: echo -ne "RS\r\n" > /dev/ttyS0
//
//IS command reads the status of the main drive inputs - can be used to poll X6/X7 end-stop limits.  This is equivalent
//   to reading the alarm status using AL, but with different bit meanings.
//
// Axis 1: X-axis
//    Camera not at end-stops: 1IS=10011111
//    Camera at far left end-stop: 1IS=11011111
//    Camera at far right end-stop: 1IS=10111111
// Axis 2: Y-axis
//    Camera at top end-stop: 2IS=10111111
//    Camera at bottom end-stop: 2IS=11011111
//
//
//SH command can be used to seek home, but usually used with 3 drive inputs and an encoder
//    - 2 endstop limit sensors
//    - 1 'home' sensor
//    - using encoder, absolute position of home is recorded, and the drive moves back to 'home' after overshooting
//       during deceleration
//    - if an end-stop is reached before 'home', then it is smart enough to switch directions and try for home again
//    - initial movement based on last DI command's sign ('-' is CCW, no sign is CW)
//
const sendCommandDriverInit = () => {
    return new Promise( (resolve) => {
        //Define limit 2 - Tells the driver that the end-stops are low-logic -- open-state indicates they are triggered
        sendCommand('DL2');
        sleep(SLEEP_INT);
        //Accelerate rate: 5 revolutions/sec/sec
        sendCommand('AC5');
        sleep(SLEEP_INT);
        //Decelerate rate: 2 revolutions/sec/sec
        sendCommand('DE2');
        sleep(SLEEP_INT);
        //Velocity rate: 3 revolutions/sec
        sendCommand('VE3');
        sleep(SLEEP_INT);
        resolve();
    });
};

const sendCommandStatus = () => {
    const p = new Promise( (resolve) => {
        sendCommand('RS');
        sleep(SLEEP_INT);
        resolve();
    });
    return(p);
}

const sendCommandHome = () => {
    const p = new Promise( (resolve) => {
        //Define position -1200000 steps (CCW) -- basically set to absurdly large number and let the limits halt the motors
        sendCommand('1DI1200000');
        sleep(SLEEP_INT);
        sendCommand('2DI-1200000');
        sleep(SLEEP_INT);
        //Feed length command
        sendCommand('FL');
        sleep(SLEEP_INT);
        resolve();
    });
    return(p);
}

const sendCommandHomeAndWait = () => {
    return sendCommandHome()
            .then( () => waitForComplete([{index: 1},{index: 2}],HOME_TIMEOUT) );
};

const sendCommandHomeX = () => {
    const p = new Promise( (resolve) => {
        //Define position -1200000 steps (CCW) along axis 1 (x-axis)
        sendCommand('1DI1200000');
        sleep(SLEEP_INT);
        sendCommand('1FL');
        sleep(SLEEP_INT);
        resolve();
    });
    return(p);
}

const sendCommandHomeY = () => {
    const p = new Promise( (resolve) => {
        //Define position -1200000 steps (CCW) along axis 1 (x-axis)
        sendCommand('2DI-1200000');
        sleep(SLEEP_INT);
        sendCommand('2FL');
        sleep(SLEEP_INT);
        resolve();
    });
    return(p);
}

const sendCommandMove = (axes)  => {
    const p = new Promise( (resolve) => {
        //Define position x steps along axis 1 (x-axis)
        axes.forEach( (axis) => {
            let axisi = axis.index;
            let steps = axis.steps;
            sendCommand(axisi + 'DI' + steps);
            sleep(SLEEP_INT);
            //Axis 1 Feed length command
            sendCommand(axisi + 'FL');
            sleep(SLEEP_INT);
        });
        resolve();
    });
    return(p);
}

const waitForComplete = (axes, timeout = 0) => {
    const checkMotionStatus = (axis, resolve,reject) => {
        sendCommand(axis.index+'RS');
        sleep(500);
        if( current_motor_states[axis.index-1] != "READY" ) {
            setTimeout(checkMotionStatus, 500, axis, resolve, reject );
        } else {
            resolve();
        }
    }

    current_motor_states[axes[0].index-1] = "MOVING"; 
    let waitUntilStoppedPromise = new Promise( (resolve, reject) => checkMotionStatus(axes[0], resolve, reject) );
    let waitUntilStoppedPromiseFinal;
    if( axes.length > 1 ) {
        current_motor_states[axes[1].index-1] = "MOVING"; 
        waitUntilStoppedPromiseFinal = waitUntilStoppedPromise.then( () => {
            let np = new Promise( (resolve, reject) => checkMotionStatus(axes[1], resolve, reject) );
            return(np);
        });
    } else {
        waitUntilStoppedPromiseFinal = waitUntilStoppedPromise;
    }

    if( timeout !== TIMEOUT_INFINITE ) {
        let timeoutPromise = new Promise( (resolve,reject) => {
                setTimeout(() => {
                    let err = {errors: {message: 'timeout'}};
                    reject(err);
                }, timeout); //Set a timeout to give up on operation, and if times out, call reject CB with timeout event
            } );
        return Promise.race([waitUntilStoppedPromiseFinal, timeoutPromise]);
    } else {
        return waitUntilStoppedPromiseFinal;
    }
};

const sendCommandMoveAndWait = (axes, timeout) => {
    return(sendCommandMove(axes)
            .then( () => waitForComplete(axes,timeout) ));
};

//
//Controller route event loop logic
//
const sendRunningStatus = (state,userId) => {
    wss.broadcast(JSON.stringify(controllerSetRunningStatus(state,userId)));
}

const sendLocation = (row, col, x, y) => {
    current_location = { row: row, col: col, x: x, y: y }; 
    wss.broadcast(JSON.stringify(controllerSetLocation(row, col, x, y)));
}

const getRoute = (project, index) => {
    let route = undefined;
    if( index < project.routeConfig.route.length ) {
        route = project.routeConfig.route[index];
    }
    return route;
}

const moveToPlate = (project, from, to) => {
    let axes = []
    let deltaX = (from.col - to.col) * project.routeConfig.distanceX * project.routeConfig.stepsPerCmX;
    axes.push({index: 1, steps: deltaX});
    let deltaY = (to.row - from.row) * project.routeConfig.distanceY * project.routeConfig.stepsPerCmY;
    axes.push({index: 2, steps: deltaY});
    return(sendCommandMoveAndWait(axes,MOVE_TIMEOUT)
            .then( () => (snapShot(current_user, project, to.row, to.col)) )
            .catch( (err) => console.log(err) ));
};

//Middleware function: Check current status and reject if not stopped
const checkIfSerial = (req, res, next) => {
    if( port === undefined ) {
        res.status(409).json({errors:
            {message: "Serial port not opened."}
        }); 
        return;
    }
    next();
};

const checkIfNotSerial = (req, res, next) => {
    if( port !== undefined ) {
        res.status(409).json({errors:
            {message: "Serial port opened."}
        }); 
        return;
    }
    next();
};

const checkIfCurrentUser = (req, res, next) => {
    if( current_user._id.toString() !== req.user._id.toString() ) {
        res.status(409).json({errors:
            {message: "Logged in user \"" + req.user._id + "\" id not equal to active user \"" + current_user._id + "\".  Operation unsupported."}
        }); 
        return;
    }
    next();
}

const checkIfUser = (req, res, next) => {
    if( current_user === undefined ) {
        res.status(409).json({errors:
            {message: "User id not set."}
        }); 
        return;
    }
    next();
};

const checkIfNotUser = (req, res, next) => {
    if( current_user !== undefined ) {
        res.status(409).json({errors:
            {message: "User id set."}
        }); 
        return;
    }
    next();
};

const checkIfProject = (req, res, next) => {
    if( current_project === undefined ) {
        res.status(409).json({errors:
            {message: "Project id not set."}
        }); 
        return;
    }
    next();
};

const checkIfNotProject = (req, res, next) => {
    if( current_project !== undefined ) {
        res.status(409).json({errors:
            {message: "Project id set."}
        }); 
        return;
    }
    next();
};

const checkIfRouteConfig = (req, res, next) => {
    if( current_project === undefined ) {
        res.status(409).json({errors:
            {message: "Project id not set."}
        }); 
        return;
    }
    if( (current_project.routeConfig === undefined) || (current_project.routeConfig._id === undefined) ) {
        res.status(409).json({errors:
            {message: "Route configuration parameters (steps per cm, distance between plates) not defined for project " + current_project.shortDescription + "."}
        }); 
        return;
    }
    next();
};


export const checkIfStopped = (req, res, next) => {
    if( current_state !== CONTROLLER_RUNNING_STATUS_STOPPED ) {
        res.status(409).json({errors:
            {message: "Current controller route in progress.  Stop route to execute this operation."}
        }); 
        return;
    }
    next();
};

const checkIfPaused = (req, res, next) => {
    if( current_state !== CONTROLLER_RUNNING_STATUS_PAUSED ) {
        res.status(409).json({errors:
            {message: "Current controller route not paused."}
        }); 
        return;
    }
    next();
};

const checkIfRunning = (req, res, next) => {
    if( current_state !== CONTROLLER_RUNNING_STATUS_RUNNING ) {
        res.status(409).json({errors: 
            {message: "Current controller route not running."}
        }); 
        return;
    }
    next();
}

const checkIfNotStopped = (req, res, next) => {
    if( current_state === CONTROLLER_RUNNING_STATUS_STOPPED) {
        res.status(409).json({errors: 
            {message: "Current controller route stopped."}
        }); 
        return;
    }
    next();
}

router.get('/list', checkIfStopped, (req, res, next) => {
    SerialPort.list()
        .then( ports => res.status(200).json({ports: ports}),
               err => res.status(409).json({errors: {message: err}}) );
});

const openPortAndInit = (path) => {
    return new Promise( (resolve,reject) => {
        let results = openPort(path);
        port = results.port;
        parser = results.parser
        if( port && parser ) {
            sendCommandDriverInit() //Initialize driver settings/state
                .then( () => resolve() )
                .catch( (err) => reject(err) );
        } else {
            reject("Failed to open serial port and/or setup Readline parser for " + path);
        }
    });
};

//Open serial port
router.put('/open', auth.sess, checkIfStopped, checkIfNotSerial, (req, res, next) => {
    return openPortAndInit(DEFAULT_SERIAL)
           .then( () => res.sendStatus(200) )
           .catch( (err) => res.status(409).json({errors: {message: err}}) );
});


router.put('/open/:path', auth.sess, checkIfStopped, checkIfNotSerial, (req, res, next) => {
    return openPortAndInit(req.params.path)
           .then( () => res.sendStatus(200) )
           .catch( (err) => res.status(409).json({errors: {message: err}}) );
});

router.get('/current', (req, res, next) => {
    res.status(200).json({ status: current_state, 
                           userId: current_user ? current_user._id : undefined, 
                           projectId: current_project ? current_project._id : undefined,
                           location: {x: current_location[0], y: current_location[1]}
                         });
    return;
});

router.put('/close', auth.sess, checkIfStopped, checkIfSerial, (req, res, next) => {
    closePort(path)
    .then( () => {
        port = undefined;
        res.sendStatus(200);
        return;
    });
});

router.put('/homex', auth.sess, checkIfStopped, checkIfSerial, checkIfUser, (req, res, next) => {
    sendCommandHomeX()
    .then( () => {
        waitForComplete([1],HOME_TIMEOUT)
        .then( () => { 
            sendLocation({col: 1, x: 0});
            res.status(200).json(current_location); 
            return;
        }, (err) => {
            res.status(400).json(err);
            return;
        });
    });
});

router.put('/homey', auth.sess, checkIfStopped, checkIfSerial, checkIfUser, (req, res, next) => {
    sendCommandHomeY()
    .then( () => {
        waitForComplete([2],HOME_TIMEOUT)
        .then( () => { 
            sendLocation({row: 1, y: 0});
            res.status(200).json(current_location);
        }, (err) => {
            res.status(400).json(err);
        });
    });
});

router.put('/home', auth.sess, checkIfStopped, checkIfSerial, checkIfUser, (req, res, next) => {
    sendCommandHome()
    .then( () => {
            sendLocation({row:1, col:1, x:0, y:0});
            res.status(200).json(current_location); 
            return;
        }, (err) => {
            sendLocation({row:1, col:1, x:0, y:0});
            res.status(200).json(current_location); 
            return;
        });
});

const moveMotors = (cardinal, units, distance) => {
    let axis;
    let conversions;
    let new_location = {...current_location};
    const getDistanceConversions = (steps_cm, distance_plates) => {
        let steps;
        let plates;
        let cm;
        switch( units ) {
            case 'plates':
                cm = distance * distance_plates;
                plates = distance;
                steps = cm * steps_cm;
                break;
            case 'cm':
                cm = units;
                plates = distance_plates/cm;
                steps = cm * steps_cm;
                break;
            default:
                break;
        }
        return({steps: steps, plates: plates, cm: cm});
    }

    switch(cardinal) {
        case 'east':
            distance = -1 * distance;
        case 'west':
            axis = 1;
            distance_bw_plate = current_project.routeConfig.distanceX;
            steps_per_cm      = current_project.routeConfig.stepsPerCmX;
            conversions       = getDistanceConversions(distance, req.params.units, steps_per_cm, distance_bw_plate);
            new_location.col  -= conversions.plates;
            new_location.x    -= conversions.cm;
            break;
        case 'north':
            distance = -1 * distance;
        case 'south':
            axis = 2;
            distance_bw_plate = current_project.routeConfig.distanceY;
            steps_per_cm      = current_project.routeConfig.stepsPerCmY;
            conversions       = getDistanceConversions(distance, req.params.units, steps_per_cm, distance_bw_plate);
            new_location.row  += conversions.plates;
            new_location.y    += conversions.cm;
            break;
        default:
            return(res.status(400).json({errros:
                {message: "Invalid cardinal direction in URL."}
            }));
    }
    sendLocation(new_location);
    return(sendCommandMoveAndWait([{index: axis, steps: conversions.steps}], MOVE_TIMEOUT));
}

router.put('/move/:cardinal/:units/:distance', auth.sess, checkIfStopped, checkIfSerial, checkIfProject, checkIfRouteConfig, (req, res, next) => {
    moveMotors(req.params.cardinal, req.params.units, req.params.distance)
    .then( () => res.status(200).json(current_location) )
    .catch( (err) => res.status(409).json({errors: {message: err}}) );
    return;
});

const setCurrentUser = (userId) => {
    return new Promise((resolve,reject) => {
        Users.findById(userId, (err, user) => {
            if( err ) {
                current_user = undefined;
                reject(err);
            } else {
                current_user = user;
                resolve(user);
            }
        });
    });
};

router.put('/user/set/:userid', auth.sess, checkIfStopped, checkIfNotUser, (req, res, next) => {
    setCurrentUser(req.params.userid)
        .then( (user) => res.status(200).json({userId: user._id}) )
        .catch( (err) => {
            return(res.status(404).json({ errors:
                { message: err }
            }));
        }); 
});

router.put('/user/clear/:userid', auth.sess, checkIfStopped, checkIfUser, (req, res, next) => {
    current_user = undefined;
    return res.sendStatus(200);
});

const setCurrentProject = (projectId) => {
    return new Promise((resolve,reject) => {
        Projects.findById(projectId)
        .populate('routeConfig')
        .populate('cameraConfig')
        .populate('experimentConfig')
        .populate('storageConfigs')
        .exec( (err, project) => {
            if( err ) {
                current_project = undefined;
                reject(err);
            } 
            if( (project.routeConfig === undefined) || (project.routeConfig._id === undefined) ) {
                reject("Route configuration not defined for project " 
                        + project.shortDescription 
                        + ".  Please define a route configuration for the current project before executing this operation.");
            }
            if( (project.cameraConfig === undefined) || (project.cameraConfig._id === undefined) ) {
                reject("Camera configuration not defined for project " 
                        + project.shortDescription 
                        + ".  Please define a camera configuration for the current project before executing this operation.");
            }
            if( (project.experimentConfig === undefined) || (project.experimentConfig._id === undefined) ) {
                reject("Experiment metadata configuration not defined for project " 
                        + project.shortDescription 
                        + ".  Please define an experiment metadata configuration for the current project before executing this operation.");
            }
            current_project = project;
            resolve(project);
        });
    });
};

router.put('/project/set/:projectid', auth.sess, checkIfStopped, checkIfNotProject, (req, res, next) => {
    setCurrentProject(req.params.projectid)
        .then( (project) => {
            return res.status(200).json({projectId: project._id});
        })
        .catch( (err) => {
            return res.status(404).json({ errors:
                { message: err }
            });
        });
});

router.put('/project/clear/:projectid', auth.sess, checkIfStopped, checkIfUser, checkIfProject, (req, res, next) => {
    current_project = undefined;
    return res.sendStatus(200);
});

const sequenceNextTick = (user, project, routeIndex) => {
    return new Promise((resolve,reject) => {
        if( routeIndex === ROUTE_INDEX_START ) {
            sendCommandHomeAndWait()
                .then( () => {
                    let nextLocation
                    current_route_index = 0;
                    nextLocation = getRoute(current_project, 0);
                    current_project_timer = pauseable.setTimeout( () => sequenceNextTick(user,project,0),
                                                                  project.routeConfig.interplateDelay * 1000);
                    moveToPlate(project, {row: 1, col: 1}, nextLocation)
                        .then( () => resolve() )
                        .catch( (err) => reject(err) );
                })
        } else {
            let delay;
            let currentLocation  = getRoute(current_project, routeIndex);
            let nextLocation     = getRoute(current_project, routeIndex+1);
            if( nextLocation ) {
                routeIndex = routeIndex + 1;
                delay = project.routeConfig.interplateDelay;
            } else {
                routeIndex = ROUTE_INDEX_START;
                delay = project.routeConfig.loopDelay;
            }
            current_project_timer = pauseable.setTimeout( () => sequenceNextTick(user,project,0),
                                                            project.routeConfig.interplateDelay * 1000);
            moveToPlate(project, currentLocation, nextLocation)
                .then( () => resolve() )
                .catch( (err) => reject(err) );
        }
    });
}

router.put('/start/:userId/:projectId', auth.sess, checkIfStopped, checkIfSerial, checkIfNotUser, checkIfNotProject, (req, res, next) => {
    //Find project in DB
    //controllerEventLoopChan.publish("notification.start", {user: current_user, project: current_project});
    setCurrentUser(req.params.userId)
        .then( (user) => setCurrentProject(req.params.projectId) )
        .then( (project) => sequenceNextTick(current_user, current_project, ROUTE_INDEX_START) )
        .then( () => {
            current_state = CONTROLLER_RUNNING_STATUS_RUNNING;
            sendRunningStatus(current_state);
            res.sendStatus(200);
        })
        .catch( (err) => {
            res.status(404).json( {errors:
                { message: err } 
            });
        });
});

    
router.put('/resume', auth.sess, checkIfPaused, checkIfSerial, checkIfUser, checkIfCurrentUser, checkIfProject, (req, res, next) => {
    if( current_project_timer && current_project_timer.isPaused() ) {
        current_project_timer.resume();
        current_state = CONTROLLER_RUNNING_STATUS_RUNNING;
        sendRunningStatus(current_state);
    }
    return res.sendStatus(200);
});

router.put('/pause', auth.sess, checkIfRunning, checkIfUser, checkIfCurrentUser, checkIfProject, (req, res, next) => {
    if( current_project_timer && !current_project_timer.isPaused() ) {
        current_project_timer.pause();
        current_state = CONTROLLER_RUNNING_STATUS_PAUSED;
        sendRunningStatus(current_state);
    }
    return res.sendStatus(200);
});

router.put('/stop', auth.sess, checkIfNotStopped, checkIfUser, checkIfCurrentUser, checkIfProject, (req, res, next) => {
    if( current_project_timer ) {
        current_project_timer.clear();
        current_project_timer = undefined;
    }
    current_state = CONTROLLER_RUNNING_STATUS_STOPPED;
    sendRunningStatus(current_state);
    current_project = undefined;
    current_user = undefined;
    return res.sendStatus(200);
});

//For now, just open the default serial port connection on load
openPortAndInit(DEFAULT_SERIAL);

module.exports = router;
