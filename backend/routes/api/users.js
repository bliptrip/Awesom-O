const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v1');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
    console.log(req.body)
    const { body: { user } } = req;

    if(!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if(!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    const finalUser = new Users(user);
    const jti = uuid();

    //Add as valid token to list of tokens
    finalUser.tokenIds.push(jti);

    finalUser.setPassword(user.password);

    return finalUser.save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }));
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    if(!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
       });
    }

    if(!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) {
            console.log("Passport authentication error: " + err.status);
            return next(err);
        }

        if(passportUser) {
            const user     = passportUser;
            const jti = uuid();

            //Add as valid token to list of tokens
            user.tokenIds.push(jti);
            user.save();

            return res.json({ user: user.toAuthJSON(jti) });
        }

        return status(400).info;
    })(req, res, next);
});

router.get('/logout', auth.required, (req, res, next) => {
    const { payload: { id, jti } } = req;

    return Users.findById(id)
    .then((user) => {
        if(!user) {
            return res.sendStatus(400);
        }

        user.tokenIds.pull(jti); //Remove the token from the database
        user.save();
        return res.sendStatus(200);
    });
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
    const { payload: { id, jti } } = req;

    return Users.findById(id)
    .then((user) => {
        if(!user) {
            return res.sendStatus(400);
        }
        
        return res.json({ user: user.toAuthJSON(jti) });
    });
});

module.exports = router;
