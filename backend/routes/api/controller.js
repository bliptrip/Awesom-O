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

import {controllerSetRunningStatus,CONTROLLER_RUNNING_STATUS_RUNNING,CONTROLLER_RUNNING_STATUS_PAUSED,CONTROLLER_RUNNING_STATUS_STOPPED,CONTROLLER_SET_LOCATION,controllerSetLocation} from '../../../frontend/src/actions';

const auth           = require('../../lib/passport').auth;
import {wss} from '../../lib/websocket';
const mongoose       = require('mongoose');
const pauseable      = require('pauseable'); //Allows pausing/resuming of timers
const postal         = require('postal'); //Sending/receiving messages across different backend modules
const router         = require('express').Router();
const SerialPort     = require('serialport');

const Projects       = mongoose.model('Projects');
const Users          = mongoose.model('Users');

const SLEEP_INT   = 100; //sleep time in milliseconds between sending subcommands on serial port
const STEPS_PER_CM = 9804; //motor steps per cm
const DEFAULT_PATH = "/dev/ttyS0";
const HOME_TIMEOUT = 30000;
const MOVE_TIMEOUT = 15000;


//Global state for storing the serial port information
var port = undefined;
//Global state for tracking controller run state, current project running, current route index
var current_project = undefined;
var current_user = undefined;
var current_project_timer = undefined;
var current_route_index;
var current_location = [0,0]; //Assume at home at init
var current_state = CONTROLLER_RUNNING_STATUS_STOPPED; //The current state of the controller

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

    lport.on('readable', () => {
        let r = lport.read().toString();
        console.log(r);
        if( r.match(/RS=AR/) ) {
            console.log('Resetting error.');
            sendCommand('1AR');
            sendCommand('2AR');
        }
    });

    return(lport);
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
    console.log(command);
    port.write(command + "\r\n");
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
const sendCommandStatus = () => {
    const p = new Promise( (resolve) => {
        //Axis 1 Servo Request status 
        sendCommand('1RS');
        sleep(SLEEP_INT);
        //Axis 2 Servo Request Status
         sendCommand('2RS');
        sleep(SLEEP_INT);
        resolve();
    });
    return(p);
}

const sendCommandHome = () => {
    const p = new Promise( (resolve) => {
        //Define limit 2
        sendCommand('DL2');
        sleep(SLEEP_INT);
        //Accelerate rate 5
        sendCommand('AC5');
        sleep(SLEEP_INT);
        //Decelerate rate 2
        sendCommand('DE2');
        sleep(SLEEP_INT);
        //Define position -1200000 steps (CCW)
        sendCommand('1DI1200000');
        sleep(SLEEP_INT);
        sendCommand('2DI-1200000');
        sleep(SLEEP_INT);
        //Velocity rate 1 rev/sec
        sendCommand('1VE3');
        sleep(SLEEP_INT);
        sendCommand('2VE3');
        sleep(SLEEP_INT);
        //Feed length command
        sendCommand('1FL');
        sleep(SLEEP_INT);
        sendCommand('2FL');
        sleep(SLEEP_INT);
        resolve();
    });
    return(p);
}

const sendCommandHomeX = () => {
    const p = new Promise( (resolve) => {
        //Define limit 2 -- end-of-travel limit occurs when an input is open (de-energized)
        sendCommand('DL2');
        sleep(SLEEP_INT);
        //Define position -1200000 steps (CCW) along axis 1 (x-axis)
        sendCommand('1DI1200000');
        sleep(SLEEP_INT);
        //Velocity axis 1
        sendCommand('1VE3');
        sleep(SLEEP_INT);
        //Axis 1 Feed length command
        sendCommand('1FL');
        sleep(SLEEP_INT);
        resolve();
    });
    return(p);
}

const sendCommandHomeY = () => {
    const p = new Promise( (resolve) => {
        //Define limit 2 -- end-of-travel limit occurs when an input is open (de-energized)
        sendCommand('DL2');
        sleep(SLEEP_INT);
        //Define position -1200000 steps (CCW) along axis 1 (x-axis)
        sendCommand('2DI-1200000');
        sleep(SLEEP_INT);
        //Velocity axis 2
        sendCommand('2VE3');
        sleep(SLEEP_INT);
        //Axis 2 Feed length command
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
            //Velocity 3
            sendCommand(axisi + 'VE3');
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
    const p = new Promise( (resolve,reject) => {
        let r = "";
        let mtimeout;
        let alarmCode = "";
        if( timeout !== 0) {
            mtimeout = setTimeout(() => {
                let err = {errors: {message: 'timeout'}};
                console.log(JSON.stringify(err));
                reject(err);
            }, timeout); //Set a timeout to give up on operation, and if times out, call reject CB with timeout event
        }
        axes.forEach( (axis) => {
            sendCommand(axis.index+'RS');
            sendCommand(axis.index+'AL');
        });
        if( timeout !== 0) {
            clearTimeout(mtimeout);
        }
        if( alarmCode !== "" ) {
            let err = {errors: {message: "alarm code: "+alarmCode}};
            console.log(JSON.stringify(err));
            reject(err);
        } else {
            resolve();
        }
    });
    return(p);
}

const sendCommandAndWait = (axes, timeout, res) => {
    sendCommandMove(axes)
    .then( () => (waitForComplete(axes,timeout)) )
    .then( () =>
            res.status(200).json({x: current_location[0], y: current_location[1]}));
};

//Controller route event loop logic -- handled by a postal subscription to controllerEventLoop with various types of notifications

var controllerEventLoopChan = postal.channel("controllerEventLoop");

const sendRunningStatus = (state,userId) => {
    wss.broadcast(JSON.stringify(controllerSetRunningStatus(state,userId)));
}

const sendLocation = (row, col) => {
    wss.broadcast(JSON.stringify(controllerSetLocation(row, col)));
}

const getRoute = (project, index) => {
    let route = undefined;
    if( index < project.routeConfig.route.length ) {
        route = project.routeConfig.route[index];
    }
    return route;
}

const moveToPlate = (project, prev, next) => {
    let axes = []
    let deltaX = (prev.x - next.x) * project.routeConfig.distanceX * project.routeConfig.stepsPerCmX;
    if( deltaX > 0 ) {
        axes.push({index: 1, steps: deltaX});
    }
    let deltaY = (prev.y - next.y) * project.routeConfig.distanceY * project.routeConfig.stepsPerCmY;
    if( deltaY > 0 ) {
        axes.push({index: 2, steps: deltaY});
    }
    sendCommandMove(axes)
        .then( () => {
            waitForComplete(axes,MOVE_TIMEOUT)
            .then( () => {
                postal.publish("camera", "route.move", {user: current_user, project: current_project});
                sendLocation(next.y, next.x);
            });
        });
};

controllerEventLoopChan.subscribe("notification.timeout", (data, envelope) => {
    let currentRoute = getRoute(current_project, data.index);
    let nextRoute    = getRoute(current_project, data.index + 1);
    //If there is no next route, we've reached the end of the loop.  Start loop over.
    if( nextRoute === undefined ) {
        current_project_timer = pauseable.setTimeout( () => {
            controllerEventLoopChan.publish("notification.start", {});
        }, current_project.route.loopDelay * 1000);
    } else { //Move to new location.  Setup a new timer to trigger next camera movement
        current_project_timer = setTimeout( () => {
            moveToPlate(current_project, currentRoute, nextRoute);
            current_route_index++;
            controllerEventLoopChan.publish("notification.timeout", {index: current_route_index});
        }, current_project.route.interplateDelay * 1000);
    }
});

controllerEventLoopChan.subscribe("notification.start", (data, envelope) => {
    let nextRoute;
    
    current_state = CONTROLLER_RUNNING_STATUS_RUNNING;
    sendRunningStatus(current_state);
    //Send home
    sendCommandHome()
    .then( () => {
        waitForComplete([1,2],HOME_TIMEOUT)
        .then( () => { 
            //Reset route index
            current_route_index = 0;
            nextRoute = getRoute(current_project, current_route_index);
            //Move to first route location -- assume home is x = 0, y = 0
            moveToPlate(current_project, {x: 0, y: 0}, nextRoute);
            current_route_index++;
            //Setup an interval timer to handle next route location
            current_project_timer = pauseable.setTimeout( () => {
                controllerEventLoopChan.publish("notification.timeout", {index: current_route_index});
            }, current_project.route.interplateDelay * 1000);
            res.sendStatus(200); 
        }, (err) => {});
    });
});

controllerEventLoopChan.subscribe("notification.resume", (data, envelope) => {
    if( current_project_timer && current_project_timer.isPaused() ) {
        current_project_timer.resume();
        current_state = CONTROLLER_RUNNING_STATUS_RUNNING;
        sendRunningStatus(current_state);
    }
});

controllerEventLoopChan.subscribe("notification.pause", (data, envelope) => {
    if( current_project_timer && !current_project_timer.isPaused() ) {
        current_project_timer.pause();
        current_state = CONTROLLER_RUNNING_STATUS_PAUSED;
        sendRunningStatus(current_state);
    }
});

controllerEventLoopChan.subscribe("notification.stop", (data, envelope) => {
    if( current_project_timer ) {
        current_project_timer.clear();
        current_project_timer = undefined;
        current_state = CONTROLLER_RUNNING_STATUS_STOPPED;
        sendRunningStatus(current_state);
    }
});

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

router.get('/list', checkIfStopped, (req, res, next) => {
    SerialPort.list()
        .then( ports => res.status(200).json({ports: ports}),
               err => res.status(409).json({errors: {message: err}}) );
});

//Open serial port
router.put('/open', auth.sess, checkIfNotSerial, checkIfStopped, (req, res, next) => {
    port = openPort(DEFAULT_PATH);
    if( port != undefined ) {
        sendCommand('DL2');
        sleep(SLEEP_INT);
        //Accelerate rate 5
        sendCommand('AC5');
        sleep(SLEEP_INT);
        //Decelerate rate 2
        sendCommand('DE2');
        res.sendStatus(200);
        return;
    } else {
        res.sendStatus(400);
        return;
    }
});


router.put('/open/:path', auth.sess, checkIfNotSerial, checkIfStopped, (req, res, next) => {
    port = openPort(req.params.path);
    if( port ) {
        res.sendStatus(200);
        return;
    } else {
        res.sendStatus(400);
        return;
    }
});

router.get('/current', (req, res, next) => {
    res.status(200).json({ status: current_state, 
                           userId: current_user ? current_user._id : undefined, 
                           projectId: current_project ? current_project._id : undefined,
                           location: {x: current_location[0], y: current_location[1]}
                         });
    return;
});

router.put('/close', auth.sess, checkIfSerial, checkIfUser, checkIfProject, checkIfStopped, (req, res, next) => {
    closePort(path)
    .then( () => {
        port = undefined;
        res.sendStatus(200);
        return;
    });
});

router.put('/homex', auth.sess, checkIfSerial, checkIfUser, checkIfStopped, (req, res, next) => {
    sendCommandHomeX()
    .then( () => {
        waitForComplete([1],HOME_TIMEOUT)
        .then( () => { 
            current_location[0] = 0;
            sendLocation(current_location[0], current_location[1]);
            res.status(200).json({x: 0, y: current_location[1]}); 
            return;
        }, (err) => {
            res.status(400).json(err);
            return;
        });
    });
});

router.put('/homey', auth.sess, checkIfSerial, checkIfUser, checkIfStopped, (req, res, next) => {
    sendCommandHomeY()
    .then( () => {
        waitForComplete([2],HOME_TIMEOUT)
        .then( () => { 
            current_location[1] = 0;
            sendLocation(current_location[0], current_location[1]);
            res.status(200).json({x: current_location[0], y: 0}); 
        }, (err) => {
            res.status(400).json(err);
        });
    });
});

router.put('/home', auth.sess, checkIfSerial, checkIfUser, checkIfStopped, (req, res, next) => {
    sendCommandHome()
    .then( () => {
            current_location = [0,0];
            sendLocation(current_location[0], current_location[1]);
            res.status(200).json({x: 0, y: 0}); 
            return;
        }, (err) => {
            current_location = [0,0];
            sendLocation(current_location[0], current_location[1]);
            res.status(200).json({x: 0, y: 0}); 
            return;
        });
});

router.put('/move/:cardinal/:units/:num', auth.sess, checkIfSerial, checkIfUser, checkIfProject, checkIfStopped, (req, res, next) => {
    let axis;
    let distance_bw_plate = 0;
    let steps_per_cm = 0;
    let steps = Number(req.params.num);
    console.log("steps "+steps.toString());
    switch( req.params.cardinal) {
        case 'east':
            steps = -1 * steps;
        case 'west':
            axis = 1;
            distance_bw_plate = current_project.routeConfig.distanceX;
            steps_per_cm      = current_project.routeConfig.stepsPerCmX;
            break;
        case 'north':
            steps = -1 * steps;
        case 'south':
            axis = 2;
            distance_bw_plate = current_project.routeConfig.distanceY;
            steps_per_cm      = current_project.routeConfig.stepsPerCmY;
            break;
        default:
            return(res.status(400).json({errros:
                {message: "Invalid cardinal direction in URL."}
            }));
    }
    distance_bw_plate = Number(distance_bw_plate);
    steps_per_cm = Number(steps_per_cm);
    console.log("distance_bw_plate "+distance_bw_plate.toString());
    console.log("steps_per_cm "+steps_per_cm.toString());
    console.log("steps "+steps.toString());
    switch( req.params.units ) {
        case 'plates':
            current_location[axis-1] += steps; //Only update location for when manually moving distance in 'plate' units
            sendLocation(current_location[0], current_location[1]);
            steps = steps * steps_per_cm * distance_bw_plate;
            break;
        case 'cm':
            steps = steps * steps_per_cm;
            break;
        default:
            break;
    }
    console.log("steps "+steps.toString());
    sendCommandAndWait([{index: axis, steps: steps}], MOVE_TIMEOUT, res);
    return;
});


router.put('/user/set/:userid', auth.sess, checkIfStopped, checkIfNotUser, (req, res, next) => {
    Users.findById(req.params.userid, (err, user) => {
        if( err ) {
            return(res.status(404).json({ errors:
                { message: "User ID "+userid+" not found in DB." }
            }));
        } 
        current_user = user;
        return res.status(200).json({userId: req.params.userid});
    });
});

router.put('/user/clear/:userid', auth.sess, checkIfStopped, checkIfUser, (req, res, next) => {
    current_user = undefined;
    return res.sendStatus(200);
});

router.put('/project/set/:projectid', auth.sess, checkIfStopped, checkIfNotProject, (req, res, next) => {
    Projects.findById(req.params.projectid)
        .populate('routeConfig')
        .exec( (err, project) => {
        if( err ) {
            return res.status(404).json({ errors:
                { message: "Project ID "+projectid+" not found in DB." }
            });
        } 
        current_project = project;
        //current_project.populate('cameraConfig');
        //current_project.populate('experimentConfig');
        //current_project.populate('storageConfigs');
        //current_project.storageConfigs.forEach( (config) => {
        //    config.populate('type');
        //});
        //current_project.populate('routeConfig');
        console.log(JSON.stringify(current_project));
        res.status(200).json({projectId: req.params.projectId});
        return;
    });
});

router.put('/project/clear/:projectid', auth.sess, checkIfStopped, checkIfUser, checkIfProject, (req, res, next) => {
    current_project = undefined;
    return res.sendStatus(200);
});

router.put('/start', auth.sess, checkIfSerial, checkIfUser, checkIfProject, checkIfStopped, (req, res, next) => {
    let userid = req.params.userid;
    let projectid = req.params.projectid;
    //Find project in DB
    controllerEventLoopChan.publish("notification.start", {user: current_user, project: current_project});
    return res.sendStatus(200);
});

    
router.put('/resume', auth.sess, checkIfSerial, checkIfUser, checkIfProject, checkIfPaused, (req, res, next) => {
    controllerEventLoopChan.publish("notification.resume", {user: current_user, project: current_project});
    return res.sendStatus(200);
});

router.put('/pause', auth.sess, checkIfSerial, checkIfUser, checkIfProject, checkIfRunning, (req, res, next) => {
    controllerEventLoopChan.publish("notification.pause", {user: current_user, project: current_project});
    return res.sendStatus(200);
});

router.put('/stop', auth.sess, checkIfSerial, checkIfUser, checkIfProject, checkIfRunning, (req, res, next) => {
    controllerEventLoopChan.publish("notification.stop", {user: current_user, project: current_project});
    return res.sendStatus(200);
});

module.exports = router;
