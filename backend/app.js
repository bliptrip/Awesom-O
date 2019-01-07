const BACKEND_PORT = 3001;

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

//Initiate our app
const app = express();

//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

if(!isProduction) {
      app.use(errorHandler());
}

//Configure Mongoose
mongoose.connect('mongodb://localhost/Awesome-O', {useNewUrlParser: true});
mongoose.set('debug', true);

//Models and Configuration
require('./models/RouteConfig');
require('./models/CameraConfig');
require('./models/ExperimentConfig');
require('./models/Projects');
require('./models/Users');
require('./config/passport');

//Routes
app.use(require('./routes'));

//Error handlers & middlewares
if(!isProduction) {
    app.use((err, req, res, next) => {
            res.status(err.status || 500);

            res.json({
                errors: {
                    message: err.message,
                    error: err,
                },
            });
            next(err)
    });
}

app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
    next(err)
});

//Express websocket library
const expressWs = require('express-ws')(app);

//Listen
app.listen(BACKEND_PORT, () => console.log("Server running on http://localhost:"+BACKEND_PORT));
