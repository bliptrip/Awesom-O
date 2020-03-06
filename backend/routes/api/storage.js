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
import {supported_types, supported_params} from '../../models/StorageConfig';
const StorageConfig = mongoose.model('StorageConfig');
const Users = mongoose.model('Users');

const auth = require('../../lib/passport').auth;

const addStorageToUser = (userId, fieldId) => {
    return(Users.updateOne({_id: userId}, {"$addToSet": {storages: fieldId}}));
}

//Create a new user -- NOTE: Eventually will want an admin to approve this
//No auth required (session or local)
router.post('/create', auth.sess, (req, res, next) => {
    let storageConfig;
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

    storageConfig = new StorageConfig({ 
        version: 1.0,
        users: [userId],
        projects: [projectId]});
    return res.json(storageConfig);
});

const saveHelper = (req,res,storageConfig) => {
    let queryId = storageConfig._id;
    return(StorageConfig.updateOne({_id: queryId}, storageConfig, {upsert: true}, function(err, resp) {
        if( err ) {
            return(res.status(422).json({ errors: resp }));
        } else {
            if( resp.upserted ) {
                let storageId = resp.upserted[0]._id;
                addStorageToUser(req.user._id, storageId).exec( (err, user) => {
                    if( err )
                        return(res.status(404).json({errors: err}));
                    else
                        return(res.json({_id: storageId}));
                });
            } else {
                return(res.json({_id: queryId}));
            }
        }
    }));
}

router.post('/save', auth.sess, (req, res, next) => {
    let storageConfig = req.body;
    return(saveHelper(req,res,storageConfig));
});

router.post('/saveas', auth.sess, (req, res, next) => {
    let storageConfigPre  = req.body;
    delete storageConfigPre._id; /* Remove the _id field. */
    let storageConfig = new StorageConfig(storageConfigPre);
    return(saveHelper(req,res,storageConfig));
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

    return StorageConfig.findById({_id: _id}, (err, storage) => {
        if( err ) {
            return res.status(422).json({
                errors: err
            });
        }
        if(!storage) {
            return res.status(422).json({
                errors: {
                    message: "StorageConfig '" + _id + "' not found."
                }
            });
        }
        //Strip off the parts of the user that we don't want to share
        return res.json(storage);
    });
});

router.get('/types', (req, res, next) => {
    return(res.status(200).json({ types: supported_types }));
});

router.get('/types/:type', (req, res, next) => {
    let stype = req.params.type;
    if( stype in supported_params ) {
        return(res.status(200).json({ params: supported_params[stype] }));
    } else {
        return(res.status(400).json({errors: {
                                        message: "Invalid storage type: " + stype + "."
                                    }}));
    }
});

router.get('/params', (req, res, next) => {
    return(res.status(200).json( supported_params ));
});

router.get('/remove/:_id', auth.sess, (req, res, next) => {
    return(res.status(422).json({ errors: "Unsupported operation" }));
});

router.get('/load/:userId', auth.sess, (req, res, next) => {
    StorageConfig.find( { users: { "$elemMatch": { "$eq": req.params.userId }}}, (err, storages) => {
        if( err ) {
            return(res.status(422).json({ errors: err }));
        } else {
            return(res.status(200).json(storages));
        }
    })
});

module.exports = router;
