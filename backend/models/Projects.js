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

const ProjectsSchema = new Schema({
    version: Number, //Table Version ID
    shortDescription: String, //shortDescription description of project for fast viewing
    description: String, //Project description as entered by user
    cameraConfig: {type: Schema.Types.ObjectId, ref: 'CameraConfig'}, //Reference to camera configuration document associated with this project
    experimentConfig: {type: Schema.Types.ObjectId, ref: 'ExperimentConfig'}, //Reference to experimental configuration document associated with this project
    storageConfigs: [{type: Schema.Types.ObjectId, ref: 'StorageConfig'}], //Reference to storage configuration document associated with this project
    routeConfig: {type: Schema.Types.ObjectId, ref: 'RouteConfig'}, //Reference to the robotic route configuration associated with this project
    users: [{type: Schema.Types.ObjectId, ref: 'Users'}] //Users with access to this project
});

mongoose.model('Projects', ProjectsSchema);
