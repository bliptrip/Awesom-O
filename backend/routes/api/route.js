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
const RouteConfig = mongoose.model('RouteConfig');
const Users = mongoose.model('Users');

const auth = require('../../lib/passport').auth;

const addRouteToUser = (userId, fieldId) => {
    return(Users.updateOne({_id: userId}, {"$addToSet": {routes: fieldId}}));
}

//Create a new user -- NOTE: Eventually will want an admin to approve this
//No auth required (session or local)
router.post('/create', auth.sess, (req, res, next) => {
    let routeConfig;
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

    routeConfig = new RouteConfig({ 
        version: 1.0,
        users: [userId],
        projects: [projectId]
    });
    return res.json(routeConfig);
});

const saveHelper = (req,res,routeConfig) => {
    let queryId = routeConfig._id;
    return(RouteConfig.updateOne({_id: queryId}, routeConfig, {upsert: true}, function(err, resp) {
        if( err ) {
            return(res.status(422).json({ errors: resp }));
        } else {
            if( resp.upserted ) {
                let routeId = resp.upserted[0]._id;
                addRouteToUser(req.user._id, routeId).exec( (err, user) => {
                    if( err )
                        return(res.status(404).json({errors: err}));
                    else
                        return(res.json({_id: routeId}));
                });
            } else {
                return(res.json({_id: queryId}));
            }
        }
    }));
}

router.post('/save', auth.sess, (req, res, next) => {
    let routeConfig = req.body;
    return(saveHelper(req,res,routeConfig));
});

router.post('/saveas', auth.sess, (req, res, next) => {
    let routeConfigPre  = req.body;
    delete routeConfigPre._id; /* Remove the _id field. */
    let routeConfig = new RouteConfig(routeConfigPre);
    return(saveHelper(req,res,routeConfig));
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

    return RouteConfig.findById({_id: _id}, (err, route) => {
        if( err ) {
            return res.status(422).json({
                errors: err
            });
        }
        if(!route) {
            return res.status(422).json({
                errors: {
                    message: "RouteConfig '" + _id + "' not found."
                }
            });
        }
        //Strip off the parts of the user that we don't want to share
        return res.json(route);
    });
});

router.get('/remove/:_id', auth.sess, (req, res, next) => {
    return(res.status(422).json({ errors: "Unsupported operation" }));
});

router.get('/load/:userId', auth.sess, (req, res, next) => {
    RouteConfig.find( { users: { "$elemMatch": { "$eq": req.params.userId }}}, (err, routes) => {
        if( err ) {
            return(res.status(422).json({ errors: err }));
        } else {
            return(res.status(200).json(routes));
        }
    })
});

module.exports = router;
