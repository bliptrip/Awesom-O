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

const auth = require('../../lib/passport').auth;

//Create a new user -- NOTE: Eventually will want an admin to approve this
//No auth required (session or local)
router.post('/create', auth.sess, (req, res, next) => {
    let routeConfig;
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
        RouteConfig.findById(templateId), (tRouteConfig, err) => {
            if(!tRouteConfig) {
                return res.status(422).json({
                    errors: {
                        message: "Template routeConfig " + _id + " not found in DB."
                    }
                });
            } else {
                routeConfig = tRouteConfig.clone()
                routeConfig.users    = [userId];
                routeConfig.projects = [projectId];
                return routeConfig.save()
                    .then(() => res.json(routeConfig));
            }
        }
    } else {
        routeConfig = new RouteConfig({ 
            version: 1.0,
            interplateDelay: 30,
            loopDelay: 14400,
            previewHooks: [],
            captureHooks: [],
            stepsPerCmX: 28888,
            stepsPerCmY: 28888,
            distanceX: 100,
            distanceY: 100,
            route: [],
            users: [userId],
            projects: [projectId]
        });
        return routeConfig.save()
            .then(() => res.json(routeConfig));
    }
});

router.post('/save', auth.sess, (req, res, next) => {
    let routeConfigJSON  = req.body;
    RouteConfig.update({_id: routeConfigJSON._id}, routeConfigJSON, {upsert: false}, function(err, resp) {
        if( err ) {
            return(res.status(422).json({ errors: resp }));
        } else {
            return(res.json({_id: routeConfigJSON._id}));
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


module.exports = router;
