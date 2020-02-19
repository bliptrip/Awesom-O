/**************************************************************************************
This file is part of Awesom-O, an image acquisition and analysis web application,
consisting of a frontend web interface and a backend database, camera, and motor access
management framework.

Copyright (C)  2019  Andrew F. Maule

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
const Users = mongoose.model('Users');
const auth = require('../../config/passport').auth;

const stripUser = (user) => {
    let {_id, username, email} = user;
    let newuser = {_id, username, email};
    return(newuser);
}

//Create a new user -- NOTE: Eventually will want an admin to approve this
//No auth required (session or local)
router.post('/create', (req, res, next) => {
    let user;
    const { username, email, password } = req.body;

    console.log(req.body);

    if(!username) {
        return res.status(422).json({
            errors: {
                username: 'is required'
            }
        });
    }

    if(!email) {
        return res.status(422).json({
            errors: {
                email: 'is required'
            }
        });
    }

    if(!password) {
        return res.status(422).json({
            errors: {
                password: 'is required'
            }
        });
    }

    user = {version: 1.0,
            username,
            email};

    const finalUser = new Users(user);

    finalUser.setPassword(password);

    return finalUser.save()
        .then(() => res.send('success'));
});

//POST login route (optional, everyone has access)
router.post('/login', auth.req, (req, res, next) => {
    //return(res.json(stripUser(req.user)));
    return(res.redirect('/'));
});

router.get('/logout', auth.sess, (req, res, next) => {
    _id = req.user._id;
    req.logout();
    return(res.json({_id}));
});

router.get('/get/:username', auth.sess, (req, res, next) => {
    console.log(req.payload)
    const { username } = req.params;

    if(!username) {
        return res.status(422).json({
            errors: {
                username: 'is required'
            }
        });
    }

    return Users.findOne({username: username}, (err, user) => {
        if( err ) {
            return res.status(422).json({
                errors: err
            });
        }
        if(!user) {
            return res.status(422).json({
                errors: {
                    message: "User '" + username + "' not found."
                }
            });
        }
        //Strip off the parts of the user that we don't want to share
        return res.json(stripUser(user));
    });
});

router.get('/remove/:_id', auth.sess, (req, res, next) => {
    const { _id } = req.params;

    if(!_id) {
        return res.status(422).json({
            errors: {
                _id: 'is required'
            }
        });
    }

    return Users.deleteOne({_id: _id}, (err, user) => {
        if( err ) {
            return res.status(422).json({
                errors: err
            });
        }
        if(!user) {
            return res.status(422).json({
                errors: {
                    message: "User " + username + " not found in DB."
                }
            });
        }
        req.logout(); //passport logout
        return res.send("Removed user with id '"+_id+"'");
    });
});


//GET current route (required, only authenticated users have access)
router.get('/current', auth.sess, (req, res, next) => {
    const { _id } = req.user._id;

    return Users.findById(_id, (err,user) => {
        if(!user) {
            return res.status(422).json({
                errors: {
                    message: "User id " + _id + " not found in DB."
                }
            });
        }
        
        return res.json(stripUser(user));
    });
});

module.exports = router;
