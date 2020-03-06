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

const passport = require('passport');

const init = (app) => {
    const LocalStrategy = require('passport-local');
    const mongoose = require('mongoose');
    const Users = mongoose.model('Users');

    passport.use(new LocalStrategy(
        function(username, password, done) {
            Users.findOne({$or: [{username: username},{email: username}]}, function (err, user) {
                if (err) { 
                    return done(err); 
                }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username or email.' });
                }
                if (!user.validatePassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(_id, done) {
        Users.findById(_id, { username: true, email: true }, function(err, user) {
            done(err, user);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());
};

/* auth is explicitly specified if either required or session-based authorization are needed. */
const auth = {
    req: passport.authenticate('local', {failureRedirect: '/login'}),
    sess: (req,res,next) => {
        if( !req.user ) {
            return(res.status(401).send("unauthorized"));
        }
        next();
    }
};

module.exports = {init, auth};
