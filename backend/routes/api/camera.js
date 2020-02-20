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

const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const CameraConfig = mongoose.model('CameraConfig');

const auth = require('../../config/passport').auth;

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
