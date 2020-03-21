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

import {viewportSetCurrentPicture,viewportSetThumbnail,viewportSetPreviewEnabled} from '../../../frontend/src/actions'; 
import {wss} from '../../lib/websocket';
import {checkIfStopped} from './controller';

const btoa         = require('btoa');
const router       = require('express').Router();
const fs           = require('fs');
const gphoto2      = require('gphoto2');
const Jimp         = require('jimp');
const mongoose     = require('mongoose');
const passport     = require('passport');
const CameraConfig = mongoose.model('CameraConfig');
const StorageConfig = mongoose.model('StorageConfig');
const Users        = mongoose.model('Users');

const auth = require('../../lib/passport').auth;
var currentPicture = undefined; //Keeps track of 

var preview_timer = undefined;
var   gphoto = new gphoto2.GPhoto2();
gphoto.setLogLevel(1);
gphoto.on('log', function (level, domain, message) {
      console.log(domain, message);
});
var camera = undefined;
var camera_list = undefined; 
var camera_thumbnails = {};

const addCameraToUser = (userId, fieldId) => {
    return(Users.updateOne({_id: userId}, {"$addToSet": {cameras: fieldId}}));
}

const checkIfPreview= (req, res, next) => {
    if( preview_timer === undefined ) {
        res.status(409).json({errors:
            {message: "Preview timer not started."}
        }); 
        return;
    }
    next();
};

const checkIfNotPreview = (req, res, next) => {
    if( preview_timer !== undefined ) {
        res.status(409).json({errors:
            {message: "Preview timer already started."}
        }); 
        return;
    }
    next();
};

const checkIfCameraList = (req, res, next) => {
    if( camera_list === undefined ) {
        res.status(409).json({errors:
            {message: "Camera list not populated."}
        }); 
        return;
    }
    next();
}

const sendPreviewEnabled = (enabled) => {
    wss.broadcast(JSON.stringify(viewportSetPreviewEnabled(enabled)));
};

export const snapShot = (user, project, row, col) => {
    return new Promise((resolve,reject) => {
        //Derive filename for image
        let prefix = 'R' + row + 'C' + col;
        //Add descriptor
        //project.experimentConfig)
        let meta = undefined;
        //project.experimentConfig.plateMeta.forEach( (m) => console.log(m.meta) );
        let metaMatches = project.experimentConfig.plateMeta.filter( m => ((m.row == row) && (m.col == col)) );
        let filename = prefix;
        if( metaMatches ) {
            meta = metaMatches[0].meta;
            filename = filename + "-" + project.experimentConfig.filenameFields.map(f => meta.get(f)).join('_');
        }
        //Append datetime?
        if( project.experimentConfig.datetime ) {
            filename   = filename + '-' + Date(Date.UTC());
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
                project.storageConfigs.forEach( (storage) => {
                    storage.saveFile(storage, user.username, filename, pdata);
                });
                encodeImage(pdata)
                    .then( (edata) => {
                        wss.broadcast(edata);
                        return Jimp.read(pdata);
                    })
                    .then( (img) => {
                        return encodeThumbnail(row,col,img);
                    })
                    .then( (thumb) => {
                        if( !camera_thumbnails[row] )
                            camera_thumbnails[row] = {};
                        camera_thumbnails[row][col] = thumb;
                        wss.broadcast(thumb);
                        resolve();
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    });
            } else {
                reject(err);
            }
        });
        //post-process hooks
    });
};

const listCameras = (res) => {
    camera = null;
    return(
        gphoto.list( (list) => {
            camera_list = list;
            if( camera_list.length > 0 ) {
                camera = list[0];
                if(res) {
                    res.status(200).json(camera_list);
                }
            }
        }));
}

listCameras(undefined); //At bootup, just grab list of cameras to fill global structures

const encodeImage = (data,useJimp=false,rotateAngle=90) => {
    const wrapup = image => {
        let src = 'data:image/jpeg;base64,' + btoa(image);
        let edata = JSON.stringify(viewportSetCurrentPicture(src));
        return(edata);
    }

    if( useJimp ) {
        return(Jimp.read(data)
                .then(img => {
                    return img.rotate(rotateAngle)
                                .getBufferAsync(Jimp.MIME_JPEG)
                                .then( image => wrapup(image) );
                })
                .catch(err => {
                    console.log(err);
                }))
    } else {
        return( new Promise( (resolve,reject) => (resolve(wrapup(data))) ) );
    }
};

const encodeThumbnail = (row,col,data) => {
    const wrapup = image => {
        let src = 'data:image/jpeg;base64,' + btoa(image);
        let edata = JSON.stringify(viewportSetThumbnail(row,col,src));
        return(edata);
    }

    return (Jimp.read(data)
            .then(img => {
                return img.resize(320,Jimp.AUTO)
                          .getBufferAsync(Jimp.MIME_JPEG);
                          .then( thumb => new Promise( (resolve,reject) => (resolve(wrapup(thumb))) ) );
            })
            .catch(err => {
                console.log(err);
            }));
};

//Retrieve/refresh cameras
router.get('/list', auth.sess, (req, res, next) => {
    camera = null;
    listCameras(res);
});

//Set camera to a particular camera
router.put('/set/:index', auth.sess, (req, res, next) => {
    let index = req.params.index;
    if( camera_list && index < camera_list.length ) {
        camera = camera_list[index];
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

//Get settings retrieves the current settings for a camera
router.get('/settings/:camIndex', auth.sess, checkIfCameraList, (req, res, next) => {
    camera_list[req.params.camIndex].getConfig( (err, sesstings) => {
        if( err ) {
            res.sendStatus(400);
        } else {
            res.json(settings);
        }
    });
});

//Put saves settings to camera
router.post('/settings', auth.sess, checkIfStopped, checkIfCameraList, (req, res, next) => {
    let camIndex = req.body.camIndex;
    let tentativeUpdates  = req.body.updates;
    let updates           = tentativeUpdates.map( u => (u.id) );
    let lcamera           = camera_list[camIndex];
    tentativeUpdates.forEach( config => {
        lcamera.setConfigValue(config.name, config.value, (err) => {
            updates = updates.filter(id => (id !== config.id));
        });
    });
    res.status(200).json(updates);
    return;
});

const captureHelper = (req, res, index) => {
    if( process.env.NODE_CAPTURE === "fs" ) {
        let path = process.env.NODE_CAPTURE_PATH;
        console.log('FS Capture Path: ' + path);
        fs.readdir( path, (err, items) => {
            if( err ) {
                return res.status(404).json({ errors:
                    { message: "Error reading directory (process.env.NODE_CAPTURE_PATH): " + path + ". Error: " + err }
                });
            } else {
                const numImages = items.length;
                const imageIndex  = Math.floor(Math.random() * numImages);
                const imageName = items[imageIndex];
                //const data = fs.readFileSync(path + "/" + imageName);
                const data = path + "/" + imageName;
                console.log("Capture FS Path: " + path + "/" + imageName);
                return(encodeImage(data)
                    .then( edata => {
                        wss.broadcast(edata);
                        return res.sendStatus(200);
                    }));
            }
        } );
    } else {
        camera_list[index].takePicture({
            download: true,
            keep: false
        }, function (err, data) {
            if( err ) {
                return res.status(400).json( {errors:
                    { message: 'gphoto2 error ' + err }
                });
            } else {
                return(encodeImage(data)
                    .then( edata => {
                        wss.broadcast(edata);
                        return res.sendStatus(200);
                    }));
            }
        });
    }
}

//Take a picture from camera and download image
router.get('/capture', auth.sess, checkIfStopped, checkIfCameraList, (req, res, next) => {
    captureHelper(req,res,0);
});

router.get('/capture/:camIndex', auth.sess, checkIfStopped, checkIfCameraList, (req, res, next) => {
    let camIndex = req.params.camIndex;
    captureHelper(req,res,camIndex);
});

router.get('/current', auth.sess, (req, res, next) => {
    if( currentPicture !== undefined ) {
        return(res.status(200).send(currentPicture));
    } else {
        return(res.status(200).json(currentPicture));
    }
});

//Preview
//
//For a reference to howto do preview, view comments from
//https://github.com/lwille/node-gphoto2/issues/64#issuecomment-76967057
const capturePreview = (req, res, index) => {
    camera_list[index].takePicture({
          preview: true,
          targetPath: '/tmp/fooXXXXXX'
    }, function(err, tmp) {
          fs.readFile(tmp, (err, data) => {
            if( err ) {
                return(res.status(404).json({error: err}));
            } else {
                fs.unlinkSync(tmp);
                return(encodeImage(data, true)
                    .then( edata => {
                        wss.broadcast(edata);
                        return res.sendStatus(200);
                    }));
            }
          })
    });
}

router.get('/preview/:camIndex', auth.sess, checkIfCameraList, (req, res, next) => {
    let enabled = (preview_timer !== undefined) ? true: false;
    return(res.status(200).json({enabled: enabled}));
});

router.put('/preview', auth.sess, checkIfStopped, checkIfCameraList, checkIfNotPreview, (req, res, next) => {
    capturePreview(req, res, 0);
});

router.put('/preview/:camIndex', auth.sess, checkIfStopped, checkIfCameraList, checkIfNotPreview, (req, res, next) => {
    let camIndex = req.params.camIndex;
    capturePreview(req, res, camIndex);
});

router.put('/preview/start/:camIndex', auth.sess, checkIfCameraList, checkIfNotPreview, (req, res, next) => {
    preview_timer = setInterval( (camIndex) => {
        camera_list[camIndex].takePicture({
            preview: true,
            targetPath: '/tmp/fooXXXXXX'
        }, function(err, tmp) {
            if( !err ) {
                sendPreviewEnabled(true); //Notify that preview is enabled
                fs.readFile(tmp, (err, data) => {
                    if( !err ) {
                        fs.unlinkSync(tmp);
                        return(encodeImage(data, true)
                            .then( edata => {
                                wss.broadcast(edata);
                            }));
                    }
                });
            } else {
                clearInterval(preview_timer);
                preview_timer = undefined;
                sendPreviewEnabled(false); //We experienced an error.  Notify that preview stopped
            }
        });
    }, 500, [req.params.camIndex] );
    return res.sendStatus(200);
});

router.put('/preview/stop/:camIndex', auth.sess, checkIfPreview, (req, res, next) => {
    clearInterval(preview_timer);
    preview_timer = undefined;
    sendPreviewEnabled(false);
    res.sendStatus(200);
});

router.put('/thumbnails/reset', auth.sess, (req, res, next) => {
    camera_thumbnails = {};
    res.status(200).send();
});

router.put('/thumbnails/get/:row/:col', auth.sess, (req, res, next) => {
    let thumb = undefined;
    if( camera_thumbnails[req.params.row] )
        thumb = camera_thumbnails[req.params.row][req.params.col]
    res.setHeader('Content-type': 'application/json');
    res.status(200).send(thumb);
});

//Create a new user -- NOTE: Eventually will want an admin to approve this
//No auth required (session or local)
router.post('/create', auth.sess, (req, res, next) => {
    let cameraConfig;
    const { userId, projectId } = req.body;

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

    cameraConfig = new CameraConfig({
        version: 1.0,
        users: [userId],
        projects: [projectId]
    });
    return res.json(cameraConfig);
});

const saveHelper = (req,res,cameraConfig) => {
    let queryId = cameraConfig._id;
    return(CameraConfig.updateOne({_id: queryId}, cameraConfig, {upsert: true}, function(err, resp) {
        if( err ) {
            return(res.status(422).json({ errors: resp }));
        } else {
            if( resp.upserted ) {
                let cameraId = resp.upserted[0]._id;
                addCameraToUser(req.user._id, cameraId).exec( (err, user) => {
                    if( err )
                        return(res.status(404).json({errors: err}));
                    else
                        return(res.json({_id: cameraId}));
                });
            } else {
                return(res.json({_id: queryId}));
            }
        }
    }));
}

router.post('/save', auth.sess, (req, res, next) => {
    let cameraConfig = req.body;
    return(saveHelper(req,res,cameraConfig));
});

router.post('/saveas', auth.sess, (req, res, next) => {
    let cameraConfigPre  = req.body;
    delete cameraConfigPre._id; /* Remove the _id field. */
    let cameraConfig = new CameraConfig(cameraConfigPre);
    return(saveHelper(req,res,cameraConfig));
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

router.get('/load/:userId', auth.sess, (req, res, next) => {
    CameraConfig.find( { users: { "$elemMatch": { "$eq": req.params.userId }}}, (err, cams) => {
        if( err ) {
            return(res.status(422).json({ errors: err }));
        } else {
            return(res.status(200).json(cams));
        }
    })
});

module.exports = router;
