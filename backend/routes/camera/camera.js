const btoa           = require('btoa');
const mongoose       = require('mongoose');
const passport       = require('passport');
const router         = require('express').Router();
const auth           = require('../auth');
const fs             = require('fs');
const gphoto2        = require('gphoto2');
const WebSocket      = require('ws');

var   gphoto = new gphoto2.GPhoto2();
var   wss = null;

// Negative value or undefined will disable logging, levels 0-4 enable it.
gphoto.setLogLevel(1);
gphoto.on('log', function (level, domain, message) {
      console.log(domain, message);
});

var camera = null;
var camera_list = [];

function listCameras() {
    camera = null;
    return(
        gphoto.list( (list) => {
            camera_list = list;
            if( camera_list.length > 0 ) {
                camera = list[0];
            }
        }));
}

//Initialize WebSocket server instance
function initializeWebSocket(server) {
    wss = new WebSocket.Server({server});

    // Broadcast preview image to all connected clients.
    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                let dataB64 = btoa(data);
                client.send('data:image/jpeg;base64,'+dataB64);
            }
        });
    };
    
    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(data) {
            // Broadcast to everyone else.
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        });
    });

    return(wss);
}

//Retrieve/refresh cameras
router.get('/list', auth.required, (req, res, next) => {
    camera = null;
    gphoto.list( (list) => {
        camera_list = list;
        if( camera_list.length > 0 ) {
            camera = list[0];
        }
        res.json(camera_list);
    });
});

//Set camera to a particular camera
router.put('/set/:index', auth.required, (req, res, next) => {
    let index = req.params.index;
    if( index < list.length ) {
        camera = list[index];
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

//Get settings retrieves the current settings for a camera
router.get('/settings', auth.required, (req, res, next) => {
    camera.getConfig( (err, settings) => {
        if( err ) {
            res.sendStatus(400);
        } else {
            res.json(settings);
        }
    });
});

//Put saves settings to camera
router.put('/settings', auth.required, (req, res, next) => {
    camera.setConfigValue(req.body.name, req.body.value, (err) => 
        {
            if(err) {
                res.status(404).send("setConfigValue failed with error code: " + JSON.stringify(err));
            } else {
                res.sendStatus(200);
            }
        });
    return;
});

//Take a picture from camera and download image
router.get('/capture', auth.required, (req, res, next) => {
    // Take picture and keep image on camera
    camera.takePicture({
        download: true,
        keep: false
    }, function (err, data) {
        if( err ) {
            res.sendStatus(400);
        } else {
            fs.writeFileSync(__dirname + '/picture.jpg', data);
            wss.broadcast(data);
            res.sendStatus(200);
        }
    });
});

//Preview
router.get('/preview', auth.required, (req, res, next) => {
    // Take picture and keep image on camera
    camera.takePicture({
        preview: true,
        download: true
    }, function (err, data) {
        if( err ) {
            res.sendStatus(400);
        } else {
            wss.broadcast(data);
            res.sendStatus(200);
        }
    });
});

module.exports = {router: router, initializeWebSocket: initializeWebSocket};
