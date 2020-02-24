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

const auth           = require('../../config/passport').auth;
const mongoose       = require('mongoose');
const pauseable      = require('pauseable'); //Allows pausing/resuming of timers
const postal         = require('postal'); //Sending/receiving messages across different backend modules
const router         = require('express').Router();
const SerialPort     = require('serialport');

const Projects       = mongoose.model('Projects');
const Users          = mongoose.model('Users');

const SLEEP_INT   = 100; //sleep time in milliseconds between sending subcommands on serial port
const STEPS_PER_CM = 9804; //motor steps per cm
const DEFAULT_PATH = "/dev/cu.USA19H142P1.1";
const HOME_TIMEOUT = 30000;
const MOVE_TIMEOUT = 15000;


//Global state for storing the serial port information
var port = undefined;
//Global state for tracking controller run state, current project running, current route index
var current_project = undefined;
var current_user = undefined;
var current_project_timer = undefined;
var current_route_index;
var current_state = "STOPPED"; //The state of the controller: "RUNNING", "STOPPED", "PAUSED"

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
        console.log('Data:' +  lport.read());
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
    port.write(command + "\r\n");
    const r = port.read();
    return(r);
}

const sendCommandStop = () => {
    return sendCommand('SK');
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
const sendCommandStatus = () => {
    const p = new Promise( (resolve) => {
        //Axis 1 Servo Request status 
        const r1 = sendCommand('1RS');
        sleep(SLEEP_INT);
        //Axis 2 Servo Request Status
        const r2 = sendCommand('2RS');
        sleep(SLEEP_INT);
        resolve(r1+'\n'+r2);
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
        sendCommand('DI-1200000');
        sleep(SLEEP_INT);
        //Velocity rate 1 rev/sec
        sendCommand('VE3');
        sleep(SLEEP_INT);
        //Feed length command
        sendCommand('FL');
        sleep(SLEEP_INT);
        resolve();
    });
    return(p);
}

const sendCommandHomeX = () => {
    const p = new Promise( (resolve) => {
        //Define limit 2
        sendCommand('DL2');
        sleep(SLEEP_INT);
        //Define position -1200000 steps (CCW) along axis 1 (x-axis)
        sendCommand('1DI-1200000');
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
        //Define limit 2
        sendCommand('DL2');
        sleep(SLEEP_INT);
        //Define position -1200000 steps (CCW) along axis 1 (x-axis)
        sendCommand('2DI-1200000');
        sleep(SLEEP_INT);
        //Velocity axis 1
        sendCommand('2VE3');
        sleep(SLEEP_INT);
        //Axis 1 Feed length command
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
        let timeout;
        let alarmCode = "";
        if( (timeout !== 0) && reject ) {
            timeout = setTimeout(() => { reject('timeout') }, timeout); //Set a timeout to give up on operation, and if times out, call reject CB with timeout event
        }
        axes.forEach( (axis) => {
            do {
                r = sendCommand(axis+'RS');
                if ( r.match(/A/g) ) {
                    console.log("Alarm: " + alarmcode);
                    //Reset alarm
                    sendCommand(axis+'AR');
                    break;
                }

                if ( r.match(/E/g) ) {
                    //Reset drive fault
                    sendCommand(axis+'AR');
                    alarmCode="AE";
                    break;
                }
            } while( alarmCode === "" );
        });
        clearTimeout(timeout);
        if( alarmCode !== "" ) {
            reject(alarmCode);
        } else {
            resolve();
        }
    });
    return(p);
}

const sendCommandAndWait = (axes, timeout, res) => {
    sendCommandMove(axes)
    .then( () => {
        waitForComplete(axes,timeout)
        .then( () => { 
            res.sendStatus(200); 
        }, (err) => {
            res.status(400).json(err);
        });
    });
};

//Controller route event loop logic -- handled by a postal subscription to controllerEventLoop with various types of notifications

var controllerEventLoopChan = postal.channel("controllerEventLoop");

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
                postal.publish("controller", "route.move", {user: current_user, project: current_project, row: next.y, col: next.x});
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
    }
});

controllerEventLoopChan.subscribe("notification.pause", (data, envelope) => {
    if( current_project_timer && !current_project_timer.isPaused() ) {
        current_project_timer.pause();
    }
});

controllerEventLoopChan.subscribe("notification.stop", (data, envelope) => {
    if( current_project_timer ) {
        current_project_timer.clear();
        current_project_timer = undefined;
    }
});

//Middleware function: Check current status and reject if not stopped
const checkIfSerial = (res, req, next) => {
    console.log("checkIfSerial begin.");
    if( port === undefined ) {
        res.status(409).json({errors:
            {message: "Serial port not opened."}
        }); 
    }
    console.log("checkIfSerial end.");
    next();
};

const checkIfNotSerial = (res, req, next) => {
    console.log("checkIfNotSerial begin.");
    if( port === undefined ) {
        res.status(409).json({errors:
            {message: "Serial port opened."}
        }); 
    }
    console.log("checkIfNotSerial end.");
    next();
};

const checkIfUser = (res, req, next) => {
    console.log("checkIfUser begin.");
    if( current_user === undefined ) {
        res.status(409).json({errors:
            {message: "User id not set."}
        }); 
    }
    console.log("checkIfUser end.");
    next();
};

const checkIfNotUser = (res, req, next) => {
    console.log("checkIfNotUser begin.");
    if( current_user !== undefined ) {
        res.status(409).json({errors:
            {message: "User id set."}
        }); 
    }
    console.log("checkIfUser end.");
    next();
};

const checkIfProject = (res, req, next) => {
    console.log("checkIfProject begin.");
    if( current_project === undefined ) {
        res.status(409).json({errors:
            {message: "Project id not set."}
        }); 
    }
    console.log("checkIfProject end.");
    next();
};

const checkIfNotProject = (res, req, next) => {
    console.log("checkIfNotProject begin.");
    if( current_project !== undefined ) {
        res.status(409).json({errors:
            {message: "Project id set."}
        }); 
    }
    console.log("checkIfProject end.");
    next();
};

const checkIfStopped = (res, req, next) => {
    console.log("checkIfStopped begin.");
    if( current_state !== "STOPPED" ) {
        res.status(409).json({errors:
            {message: "Current controller route in progress.  Stop route to execute this operation."}
        }); 
    }
    console.log("checkIfStopped end.");
    next();
};

const checkIfPaused = (res, req, next) => {
    if( current_state !== "PAUSED" ) {
        res.status(409).json({errors:
            {message: "Current controller route not paused."}
        }); 
        return;
    }
    next();
};

const checkIfRunning = (res, req, next) => {
    if( current_state !== "RUNNING" ) {
        res.status(409).json({errors: 
            {message: "Current controller route not running."}
        }); 
        return;
    }
    next();
}

//Open serial port
router.put('/open', auth.sess, checkIfStopped, (req, res, next) => {
    console.log("Opening default port.");
    port = openPort(DEFAULT_PATH);
    if( port != undefined ) {
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

router.put('/open/:path', auth.sess, checkIfStopped, (req, res, next) => {
    console.log("Opening non-default port.");
    port = openPort(req.params.path);
    if( port ) {
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

router.put('/close', auth.sess, checkIfSerial, checkIfUser, checkIfProject, checkIfStopped, (req, res, next) => {
    closePort(path)
    .then( () => {
        port = undefined;
        res.sendStatus(200);
    });
});

router.put('/homex', auth.sess, checkIfSerial, checkIfUser, checkIfProject, checkIfStopped, (req, res, next) => {
    sendCommandHomeX()
    .then( () => {
        waitForComplete([1],HOME_TIMEOUT)
        .then( () => { 
            res.sendStatus(200); 
        }, (err) => {
            res.status(400).json(err);
        });
    });
});

router.put('/homey', auth.sess, checkIfSerial, checkIfUser, checkIfProject, checkIfStopped, (req, res, next) => {
    sendCommandHomeY()
    .then( () => {
        waitForComplete([2],HOME_TIMEOUT)
        .then( () => { res.sendStatus(200); },
        (err) => {
            res.status(400).json(err);
        });
    });
});

router.put('/home', auth.sess, checkIfSerial, checkIfUser, checkIfProject, checkIfStopped, (req, res, next) => {
    sendCommandHome()
    .then( () => {
        waitForComplete([1,2],HOME_TIMEOUT)
        .then( () => {
            res.sendStatus(200); 
        }, (err) => {
            res.status(400).json(err);
        });
    });
});

router.put('/move/:cardinal/:units/:num', auth.sess, checkIfSerial, checkIfUser, checkIfProject, checkIfStopped, (req, res, next) => {
    let axis;
    let distance_bw_plate;
    let steps_per_cm;
    let steps = req.params.num;
    switch( req.params.cardinal) {
        case 'east':
            steps = -steps;
        case 'west':
            axis = 1;
            distance_bw_plate = current_project.routeConfig.distanceX;
            steps_per_cm      = current_project.routeConfig.stepsPerCmX;
            break;
        case 'north':
            steps = -steps;
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
    switch( req.params.units ) {
        case 'plates':
            steps = steps * steps_per_cm * distance_bw_plate;
        case 'cm':
            steps = steps * steps_per_cm;
            break;
        default:
            break;
    }
    sendCommandAndWait({index: axis, steps: steps}, MOVE_TIMEOUT, res);
});


router.put('/user/set/:userid', auth.sess, checkIfStopped, checkIfNotUser, (req, res, next) => {
    Users.findById(req.params.userid, (err, user) => {
        if( err ) {
            return(res.status(404).json({ errors:
                { message: "User ID "+userid+" not found in DB." }
            }));
        } 
        current_user = user;
        return res.status(200);
    });
});

router.put('/user/clear/:userid', auth.sess, checkIfStopped, checkIfUser, (req, res, next) => {
    current_user = undefined;
    return res.status(200);
});

router.put('/project/set/:projectid', auth.sess, checkIfStopped, checkIfNotUser, checkIfNotProject, (req, res, next) => {
    Projects.findById(req.params.projectid, (err, project) => {
        if( err ) {
            return res.status(404).json({ errors:
                { message: "Project ID "+projectid+" not found in DB." }
            });
        } 
        current_project = project;
        current_project.populate('cameraConfig');
        current_project.populate('experimentConfig');
        current_project.populate('storageConfigs');
        current_project.storageConfigs.forEach( (config) => {
            config.populate('type');
        });
        current_project.populate('routeConfig');
        return res.status(200);
    });
});

router.put('/project/clear/:projectid', auth.sess, checkIfStopped, checkIfUser, checkIfProject, (req, res, next) => {
    current_project = undefined;
    return res.status(200);
});

router.put('/start', auth.sess, checkIfSerial, checkIfUser, checkIfProject, checkIfStopped, (req, res, next) => {
    let userid = req.params.userid;
    let projectid = req.params.projectid;
    //Find project in DB
    current_state = "RUNNING";
    controllerEventLoopChan.publish("notification.start", {user: current_user, project: current_project});
    return res.status(200);
});

    
router.put('/resume', auth.sess, checkIfSerial, checkIfUser, checkIfProject, checkIfPaused, (req, res, next) => {
    current_state = "RUNNING";
    controllerEventLoopChan.publish("notification.resume", {user: current_user, project: current_project});
    return;
});

router.put('/pause', auth.sess, checkIfSerial, checkIfUser, checkIfProject, checkIfRunning, (req, res, next) => {
    current_state = "PAUSED";
    controllerEventLoopChan.publish("notification.pause", {user: current_user, project: current_project});
    return;
});

router.put('/stop', auth.sess, checkIfSerial, checkIfUser, checkIfProject, checkIfRunning, (req, res, next) => {
    controllerEventLoopChan.publish("notification.stop", {user: current_user, project: current_project});
    current_state = "STOPPED";
    return;
});

module.exports = router;
