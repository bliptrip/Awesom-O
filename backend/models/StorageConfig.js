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

const fs       = require('fs');
const mkdirp   = require('mkdirp');
const mongoose = require('mongoose');
const {Schema} = mongoose;

//Right now only support local paths
export const supported_types = [ 'fs' ];
export const supported_params = { 'fs': {'path': 'String'} };
export const supported_type_default = 'fs'; /* Default to local filesystem storage */
export const supported_param_defaults = { 'fs': {'path': '/'} }; /* Default local filesystem path */

const StorageConfigSchema = new Schema({
    version: Number, //Table Version ID
    shortDescription: {
        type: String,
        default: "New Storage Configuration"
    },
    storageType: {
        type: String, //Storage type -- fs , box.com, dropbox.com, google drive, etc.
        enum: supported_types,
        default: supported_type_default,
    },
    params: {
        type: Map, 
        of: String,
        default: supported_param_defaults[supported_type_default]}, //representation of parameters specific to each supported type of storage -- only support local storage for now
    users: [{type: Schema.Types.ObjectId, ref: 'Users'}], //Users with access to this StorageConfig
    projects: [{type: Schema.Types.ObjectId, ref: 'Projects'}] //Projects with access to this StorageConfig
});

/* New storage config params validator is giving me trouble.
        validate: {
            validator: function(v) {
                        let validKeys = Object.keys(supported_params[this.storageType]);
                        return( Object.keys(v).reduce( (valid, curr) => (valid && validKeys.includes(curr)), true ) );
            },
            message: props => `${props.value} are not valid parameters for this storage type`
        },
*/

StorageConfigSchema.methods.saveFile = (storageC, username, filename, data) => {
    switch( storageC.storageType ) {
        case 'fs':
            let fullpath = '/home/gilroylab/.awesomo/' + username + '/' + storageC.params.get('path');
            mkdirp(fullpath).then( made => fs.writeFileSync(fullpath  + '/' + filename, data) );
            break;
        default:
            break;
    }
    return;
}

mongoose.model('StorageConfig', StorageConfigSchema);
