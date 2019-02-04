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

const {Schema} = mongoose;

const RouteLocationSchema = new Schema({x: Number, y: Number})

const RouteConfigSchema = new Schema({
    version: Number,
    interplateDelay: Number, //In seconds
    loopDelay: Number,  //In seconds
    previewHooks: [String], //List of preview hook scripts to call
    captureHooks: [String], //List of capture hook scripts to call
    stepsPerCmX: Number, //Motor steps/cm in x direction
    stepsPerCmY: Number, //Motor steps/cm in y direction
    distanceX: Number, //X distance in cm b/w plates
    distanceY: Number, //Y distance in cm b/w plates
    route: [RouteLocationSchema]
});

mongoose.model('RouteConfig', RouteConfigSchema);
