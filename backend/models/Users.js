//Taken from https://medium.freecodecamp.org/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e
//NOTE: See if can optimize to use asynchronous crypto.pbkdf2Sync() calls?
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UsersSchema = new Schema({
    email: String,
    hash: String,
    salt: String,
    tokenIds: [String],
});

UsersSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UsersSchema.methods.generateJWT = function(tokenid) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    const expiration = parseInt(expirationDate.getTime() / 1000, 10);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: expiration,
        jti: tokenid,
       }, 'awesome-No');
}

UsersSchema.methods.toAuthJSON = function(tokenid) {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(tokenid),
    };
};

mongoose.model('Users', UsersSchema);
