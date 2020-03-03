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
const Projects = mongoose.model('Projects');

const auth = require('../../lib/passport').auth;

//Create a new user -- NOTE: Eventually will want an admin to approve this
//No auth required (session or local)
router.post('/create', auth.sess, (req, res, next) => {
    let project;
    const { userId, templateId } = req.body;

    if(!userId) {
        return res.status(422).json({
            errors: {
                userId: 'is required'
            }
        });
    }

    if(templateId) {
        Projects.findById(templateId), (tproject, err) => {
            if(!tproject) {
                return res.status(422).json({
                    errors: {
                        message: "Template project " + _id + " not found in DB."
                    }
                });
            } else {
                project = tproject.clone()
                project.populate('cameraConfig')
                project.populate('experimentConfig')
                project.populate('storageConfigs')
                project.populate('routeConfig');
                project.users                = [userId];
                project.cameraConfig.users    = [userId];
                project.cameraConfig.projects = [project._id];
                project.experimentConfig.users    = [userId];
                project.experimentConfig.projects = [project._id];
                project.storageConfigs.forEach( (s) => {
                                                    s.users = [userId]; 
                                                    s.projects = [project._id]
                });
                project.routeConfig.users    = [userId];
                project.routeConfig.projects = [project._id];
                return project.save()
                    .then(() => res.json(project));
            }
        }
    } else {
        project = new Projects({ version: 1.0,
                                description: ""
                             });
        project.users   = [userId];
        return project.save()
            .then(() => res.json(project));
    }
});

router.post('/save', auth.sess, (req, res, next) => {
    let projectJSON  = req.body;
    console.log( projectJSON );
    Projects.update({_id: projectJSON._id}, projectJSON, {upsert: false}, function(err, resp) {
        if( err ) {
            return(res.status(422).json({ errors: resp }));
        } else {
            return(res.json({_id: projectJSON._id}));
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

    return Projects.findById(_id, (err, project) => {
        if( err ) {
            return res.status(422).json({
                errors: err
            });
        }
        if(!project) {
            return res.status(422).json({
                errors: {
                    message: "Project '" + _id + "' not found."
                }
            });
        }
        //Strip off the parts of the user that we don't want to share
        return res.json(project);
    });
});

router.get('/remove/:_id', auth.sess, (req, res, next) => {
    return(res.status(422).json({ errors: "Unsupported operation" }));
});

router.get('/load/:userId', auth.sess, (req, res, next) => {
    Projects.find( { users: { "$elemMatch": { "$eq": req.params.userId }}}, (err, projects) => {
        if( err ) {
            return(res.status(422).json({ errors: err }));
        } else {
            return(res.status(200).json(projects));
        }
    })
});


module.exports = router;
