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

const CameraConfigSchema = new Schema({
    version: Number, //Table Version ID
    shortDescription: {
        type: String, //Camera shortDescription description string
        default: "New Camera Configuration"
    },
    description: {
        type: String, //Camera description string
        default: ""
    },
    manufacturer: {
        type: String, //Manufacturer
        default: ""
    },
    model: {
        type: String, //Camera model
        default: ""
    },
    deviceVersion: {
        type: String, //Camera device version
        default: ""
    },
    sn: {
        type: String, //Camera serial number
        default: ""
    },
    gphoto2Config: String, //JSONified string representation of the camera configuration, as recognized by gphoto2
    users: [{type: Schema.Types.ObjectId, ref: 'Users'}], //Users with access to this CameraConfig
    projects: [{type: Schema.Types.ObjectId, ref: 'Projects'}] //Projects with access to this CameraConfig
});

mongoose.model('CameraConfig', CameraConfigSchema);
