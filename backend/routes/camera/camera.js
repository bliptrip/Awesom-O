const btoa           = require('btoa');
const mongoose       = require('mongoose');
const passport       = require('passport');
const postal         = require('postal'); //Sending/receiving messages across different backend modules
const router         = require('express').Router();
const auth           = require('../auth');
const fs             = require('fs');
const gphoto2        = require('gphoto2');

var   gphoto = new gphoto2.GPhoto2();

// Negative value or undefined will disable logging, levels 0-4 enable it.
gphoto.setLogLevel(1);
gphoto.on('log', function (level, domain, message) {
      console.log(domain, message);
});

var camera = null;
var camera_list = [];

const listCameras = () => {
    camera = null;
    return(
        gphoto.list( (list) => {
            camera_list = list;
            if( camera_list.length > 0 ) {
                camera = list[0];
            }
        }));
}

const encodeImage = (data, x=-1, y=-1) => {
    let src = 'data:image/jpeg;base64,' + btoa(data);
    if( (x !== -1) || (y !== -1) ) {
        let edata = JSON.stringify({type: "RECEIVE_CURRENT_PICTURE", src: src, position: { x: x, y: y }});
    } else {
        let edata = JSON.stringify({type: "RECEIVE_CURRENT_PICTURE", src: src});
    }
    return(edata);
};

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
    if( process.env.NODE_CAPTURE === "fs" ) {
        path = process.env.NODE_CAPTURE_PATH;
        fs.readdir( path, (err, items) => {
            if( err ) {
                console.log("Error reading directory: " + path + " Error: " + err);
                res.end();
            } else {
                const numImages = items.length;
                const imageIndex  = Math.floor(Math.random() * numImages);
                const imageName = items[imageIndex];
                const data = fs.readFileSync(path + "/" + imageName);
                console.log("Capture FS Path: " + path + "/" + imageName);
                edata = encodeImage(data);
                wss.broadcast(edata);
                res.sendStatus(200);
                res.end();
            }
        });
    } else {
        camera.takePicture({
            download: true,
            keep: false
        }, function (err, data) {
            if( err ) {
                res.sendStatus(400);
                res.end();
            } else {
                let edata = encodeImage(data);
                wss.broadcast(edata);
                res.sendStatus(200);
                res.end();
            }
        });
    }
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
            let edata = encodeImage(data);
            wss.broadcast(edata);
            res.sendStatus(200);
        }
    });
});

var subscription = postal.subscribe({
    channel: "controller",
    topic: "route.move",
    callback: function(data, envelope) {
        // `data` is the data published by the publisher.
        // `envelope` is a wrapper around the data & contains
        // metadata about the message like the channel, topic,
        // timestamp and any other data which might have been
        // added by the sender.
        let projectConfig     = data.projectConfig;
        //Derive filename for image
        let prefix = 'R' + data.row.pad(2,'0')+'C'+data.col.pad(2,'0');
        let imagePath = projectConfig.imagePath + '/' + prefix + '/';
        let filename = prefix;
        //Add descriptor
        filename = prefix + "-" + projectConfig.experimentConfig.filenameFields.join('_');
        //Append datetime?
        if( projectConfig.experimentConfig.datetime ) {
            filename   = prefix + '-' + new Date(Date.UTC());
        }
        //Append extension -- assume jpg for now -- need a way to poll for format
        filename = filename + '.jpg'
        //process any preview hooks
        //Take picture
        camera.takePicture({
            download: true,
            keep: false
        }, function (err, pdata) {
            if( !err ) {
                fs.writeFileSync(imagePath + filename, pdata);
                edata = encodeImage(pdata, x = data.x, y = data.y);
                wss.broadcast(edata);
            }
        });
        //post-process hooks
    }
});

module.exports = router;
