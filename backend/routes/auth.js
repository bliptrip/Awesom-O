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

const jwt = require('express-jwt');
const mongoose = require('mongoose');

const Users = mongoose.model('Users');

const getTokenFromHeaders = (req) => {
    console.log("Get token from headers.");
    const { headers: { authorization } } = req;

    if(authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }
    return null;
};

const isTokenRevoked = (req, payload, done) => {
    var id = payload.id;
    
    return Users.findById(id)
    .then((user) => {
        console.log("isTokenRevoked(payload) {");
        console.log("   JSON Token ID: " + payload.jti);
        console.log("   DB Tokens: " + user.tokenIds);
        console.log("}");
        if ( user.tokenIds.includes(payload.jti) ) {
            return done(null, false);
        } else {
            return done(null, true);
        }
    });
};


const auth = {
    required: jwt({
        secret: 'awesome-No',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        isRevoked: isTokenRevoked
    }),
    optional: jwt({
        secret: 'awesome-No',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
};

module.exports = auth;
