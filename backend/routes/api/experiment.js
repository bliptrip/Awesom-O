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
const ExperimentConfig = mongoose.model('ExperimentConfig');
const Users = mongoose.model('Users');

const auth = require('../../lib/passport').auth;

const addExperimentToUser = (userId, fieldId) => {
    return(Users.updateOne({_id: userId}, {"$addToSet": {experiments: fieldId}}));
}

//Create a new user -- NOTE: Eventually will want an admin to approve this
//No auth required (session or local)
router.post('/create', auth.sess, (req, res, next) => {
    let experimentConfig;
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

    experimentConfig = new ExperimentConfig({  
        version: 1.0,
        users: [userId],
        projects: [projectId]
    });
    return res.json(experimentConfig);
});

const saveHelper = (req,res,experimentConfig) => {
    let queryId = experimentConfig._id;
    return(ExperimentConfig.updateOne({_id: queryId}, experimentConfig, {upsert: true}, function(err, resp) {
        if( err ) {
            return(res.status(422).json({ errors: resp }));
        } else {
            if( resp.upserted ) {
                let experimentId = resp.upserted[0]._id;
                addExperimentToUser(req.user._id, experimentId).exec( (err, user) => {
                    if( err )
                        return(res.status(404).json({errors: err}));
                    else
                        return(res.json({_id: experimentId}));
                });
            } else {
                return(res.json({_id: queryId}));
            }
        }
    }));
}

router.post('/save', auth.sess, (req, res, next) => {
    let experimentConfig = req.body;
    return(saveHelper(req,res,experimentConfig));
});

router.post('/saveas', auth.sess, (req, res, next) => {
    let experimentConfigPre  = req.body;
    delete experimentConfigPre._id; /* Remove the _id field. */
    let experimentConfig = new ExperimentConfig(experimentConfigPre);
    return(saveHelper(req,res,experimentConfig));
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

    return ExperimentConfig.findById({_id: _id}, (err, experiment) => {
        if( err ) {
            return res.status(422).json({
                errors: err
            });
        }
        if(!experiment) {
            return res.status(422).json({
                errors: {
                    message: "ExperimentConfig '" + _id + "' not found."
                }
            });
        }
        //Strip off the parts of the user that we don't want to share
        return res.json(experiment);
    });
});

router.get('/remove/:_id', auth.sess, (req, res, next) => {
    return(res.status(422).json({ errors: "Unsupported operation" }));
});

router.get('/load/:userId', auth.sess, (req, res, next) => {
    ExperimentConfig.find( { users: { "$elemMatch": { "$eq": req.params.userId }}}, (err, experiments) => {
        if( err ) {
            return(res.status(422).json({ errors: err }));
        } else {
            return(res.status(200).json(experiments));
        }
    })
});

module.exports = router;
