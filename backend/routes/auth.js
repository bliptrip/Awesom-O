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
