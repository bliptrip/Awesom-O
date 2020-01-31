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

const PlateSchema = new Schema({
    version: Number, //Table Version ID
    row: Number, //Row of plate
    col: Number, //Column of plate
    meta: {type: Map, of: String} //Experimental metadata fields associated with plate
});

const ExperimentConfigSchema = new Schema({
    version: Number, //Table Version ID
    datetime: Boolean, //Append datetime suffix to files as they are created
    rename: Boolean, //Rename files from default
    imageMeta: Boolean, //Embed metadata in image file, if supported
    filenameFields: [String], //Which metadata fields include in filename, in order listed
    config: [PlateSchema]
});

mongoose.model('ExperimentConfig', ExperimentConfigSchema);
