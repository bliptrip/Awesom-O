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
const Users = mongoose.model('Users');

const auth = require('../../lib/passport').auth;

const addProjectToUser = (userId, fieldId) => {
    return(Users.updateOne({_id: userId}, {"$addToSet": {projects: fieldId}}));
}

//Create a new user -- NOTE: Eventually will want an admin to approve this
//No auth required (session or local)
router.post('/create', auth.sess, (req, res, next) => {
    let project;
    const userId = req.user._id;

    project = new Projects({ 
        version: 1.0,
        users: [userId]
    });
    return res.json(project);
});

const saveHelper = (req, res, project) => {
    let queryId = project._id;
    return(Projects.updateOne({_id: queryId}, project, {upsert: true}, function(err, resp) {
        if( err ) {
            return(res.status(422).json({ errors: resp }));
        } else {
            if( resp.upserted ) {
                let projectId = resp.upserted[0]._id;
                addProjectToUser(req.user._id, projectId).exec( (err, user) => {
                    if( err )
                        return(res.status(404).json({errors: err}));
                    else
                        return(res.json({_id: projectId}));
                });
            } else {
                return(res.json({_id: queryId}));
            }
        }
    }));
}

router.post('/save', auth.sess, (req, res, next) => {
    let project = req.body;
    return(saveHelper(req,res,project));
});

router.post('/saveas', auth.sess, (req, res, next) => {
    let projectPre  = req.body;
    delete projectPre._id; /* Remove the _id field. */
    let project = new Projects(projectPre);
    return(saveHelper(req,res,project));
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

    return(Projects.findById(_id)
        .populate('cameraConfig')
        .populate('experimentConfig')
        .populate('routeConfig')
        .populate('storageConfigs')
        .exec( (err, project) => {
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
        }));
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
