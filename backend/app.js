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

const BACKEND_PORT = 3001;

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session'); //Needed for passport sessions
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const http = require('http'); //Simple http server
const WebSocket      = require('ws');
const localpassport = require('./lib/passport');
const wss = require('./lib/websocket');

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

//Initiate our app
const app = express();

//Initialize http server
const server = http.createServer(app);

wss.init(server);

//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard squirrel' })); //Needed for passport to work, but must be called before passport init
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Configure Mongoose
mongoose.connect('mongodb://localhost/AwesomO', {useNewUrlParser: true});
mongoose.set('debug', true);

//Models and Configuration
require('./models/CameraConfig');
require('./models/ExperimentConfig');
require('./models/Projects');
require('./models/RouteConfig');
require('./models/StorageConfig');
require('./models/Users');

//Finish setting up passport
localpassport.init(app); //Initialize my passport strategy and session

//Routes
app.use(require('./routes'));

//Error handlers & middlewares
if(!isProduction) {
    app.use(errorHandler());
}

//Listen
server.listen(BACKEND_PORT, () => console.log("Server running on http://localhost:"+BACKEND_PORT));
