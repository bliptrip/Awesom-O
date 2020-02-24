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

import {viewportSetCurrentPicture} from '../../../frontend/src/actions'; 
const btoa         = require('btoa');
const router       = require('express').Router();
const fs           = require('fs');
const gphoto2      = require('gphoto2');
const mongoose     = require('mongoose');
const passport     = require('passport');
const postal       = require('postal'); //Sending/receiving messages across different backend modules
const CameraConfig = mongoose.model('CameraConfig');

import {wss} from '../../lib/websocket';
const auth = require('../../lib/passport').auth;

var   gphoto = new gphoto2.GPhoto2();
gphoto.setLogLevel(1);
gphoto.on('log', function (level, domain, message) {
      console.log(domain, message);
});
var camera = undefined;
var camera_list = [];
var subscription = postal.subscribe({
    channel: "camera",
    topic: "route.move",
    callback: function(data, envelope) {
        // `data` is the data published by the publisher.
        // `envelope` is a wrapper around the data & contains
        // metadata about the message like the channel, topic,
        // timestamp and any other data which might have been
        // added by the sender.
        let project     = data.project;
        //Derive filename for image
        let prefix = 'R' + data.row.pad(2,'0')+'C'+data.col.pad(2,'0');
        //Add descriptor
        let filename = prefix + "-" + project.experimentConfig.filenameFields.join('_');
        //Append datetime?
        if( project.experimentConfig.datetime ) {
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
                project.storageConfigs.foreach( (storage) => {
                    storage.saveFile(filename, pdata);
                });
                edata = encodeImage(pdata);
                wss.broadcast(edata);
            }
        });
        //post-process hooks
    }
});

const listCameras = () => { camera = null; return( gphoto.list( (list) => { camera_list = list; if( camera_list.length >
    0 ) { camera = list[0]; } })); }

const encodeImage = (data) => {
    let edata;
    let src = 'data:image/jpeg;base64,' + btoa(data);
    edata = JSON.stringify(viewportSetCurrentPicture(src));
    return(edata);
};

//Retrieve/refresh cameras
router.get('/list', auth.sess, (req, res, next) => {
    camera = null;
    gphoto.list( (list) => {
        camera_list = list;
        if( camera_list.length > 0 ) {
            camera = list[0];
        }
        return(res.status(200).json(camera_list));
    });
});

//Set camera to a particular camera
router.put('/set/:index', auth.sess, (req, res, next) => {
    let index = req.params.index;
    if( index < list.length ) {
        camera = list[index];
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

//Get settings retrieves the current settings for a camera
router.get('/settings', auth.sess, (req, res, next) => {
    camera.getConfig( (err, settings) => {
        if( err ) {
            res.sendStatus(400);
        } else {
            res.json(settings);
        }
    });
});

//Put saves settings to camera
router.put('/settings', auth.sess, (req, res, next) => {
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
router.get('/capture', auth.sess, (req, res, next) => {
    // Take picture and keep image on camera
    if( process.env.NODE_CAPTURE === "fs" ) {
        path = process.env.NODE_CAPTURE_PATH;
        fs.readdir( path, (err, items) => {
            if( err ) {
                return res.status(404).json({ errors:
                    { message: "Error reading directory (process.env.NODE_CAPTURE_PATH): " + path + ". Error: " + err }
                });
            } else {
                const numImages = items.length;
                const imageIndex  = Math.floor(Math.random() * numImages);
                const imageName = items[imageIndex];
                const data = fs.readFileSync(path + "/" + imageName);
                console.log("Capture FS Path: " + path + "/" + imageName);
                edata = encodeImage(data);
                wss.broadcast(edata);
                return res.status(200);
            }
        });
    } else {
        camera.takePicture({
            download: true,
            keep: false
        }, function (err, data) {
            if( err ) {
                return res.status(400).json( {errors:
                    { message: 'gphoto2 error ' + err }
                });
            } else {
                let edata = encodeImage(data);
                wss.broadcast(edata);
                return res.status(200);
            }
        });
    }
});

//Preview
router.get('/preview', auth.sess, (req, res, next) => {
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

//Create a new user -- NOTE: Eventually will want an admin to approve this
//No auth required (session or local)
router.post('/create', auth.sess, (req, res, next) => {
    let cameraConfig;
    const { userId, projectId, templateId } = req.body;

    if(!userId) {
        return res.status(422).json({
            errors: {
                userId: 'is required'
            }
        });
    }

    if(!projectId) {
        return res.status(422).json({
            errors: {
                projectId: 'is required'
            }
        });
    }

    if(templateId) {
        CameraConfig.findById(templateId), (tCameraConfig, err) => {
            if(!tCameraConfig) {
                return res.status(422).json({
                    errors: {
                        message: "Template cameraConfig " + _id + " not found in DB."
                    }
                });
            } else {
                cameraConfig = tCameraConfig.clone()
                cameraConfig.users    = [userId];
                cameraConfig.projects = [projectId];
                return cameraConfig.save()
                    .then(() => res.json(cameraConfig));
            }
        }
    } else {
        cameraConfig = new CameraConfig({ version: 1.0 });
        cameraConfig.description = "";
        cameraConfig.manufacturer = "";
        cameraConfig.model = "";
        cameraConfig.deviceVersion = "";
        cameraConfig.sn = "";
        cameraConfig.gphoto2Config = "";
        cameraConfig.users    = [userId];
        cameraConfig.projects = [projectId];
        return cameraConfig.save()
            .then(() => res.json(cameraConfig));
    }
});

router.post('/save', auth.sess, (req, res, next) => {
    let cameraConfigJSON  = req.body;
    CameraConfig.update({_id: cameraConfigJSON._id}, cameraConfigJSON, {upsert: false}, function(err, resp) {
        if( err ) {
            return(res.status(422).json({ errors: resp }));
        } else {
            return(res.json({_id: cameraConfigJSON._id}));
        }
    });
});

router.get('/get/:_id', auth.sess, (req, res, next) => {
    const { _id } = req.params;

    if(!_id) {
        return res.status(422).json({
            errors: {
                _id: 'is required'
            }
        });
    }

    return CameraConfig.findById({_id: _id}, (err, camera) => {
        if( err ) {
            return res.status(422).json({
                errors: err
            });
        }
        if(!camera) {
            return res.status(422).json({
                errors: {
                    message: "CameraConfig '" + _id + "' not found."
                }
            });
        }
        //Strip off the parts of the user that we don't want to share
        return res.json(camera);
    });
});

router.get('/remove/:_id', auth.sess, (req, res, next) => {
    return(res.status(422).json({ errors: "Unsupported operation" }));
});


module.exports = router;
