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
const mongoose = require('mongoose');
const {Schema} = mongoose;

//Right now only support local paths
export const supported_types = [ 'fs' ];
export const supported_params = { 'fs': [{'path': 'String'}] }

const StorageConfigSchema = new Schema({
    version: Number, //Table Version ID
    shortDescription: String,
    storageType: {
        type: String, //Storage type -- fs , box.com, dropbox.com, google drive, etc.
        enum: supported_types,
        required: true },
    params: {
        type: Map, 
        validate: {
            validator: function(v) {
                        let validKeys = Object.keys(supported_params[this.storageType]);
                        return( Object.keys(v) in validKeys );
            },
            message: props => `${props.value} are not valid paramers for this storage type`
        },
        of: String }, //representation of parameters specific to each supported type of storage -- only support local storage for now
    users: [{type: Schema.Types.ObjectId, ref: 'Users'}], //Users with access to this StorageConfig
    projects: [{type: Schema.Types.ObjectId, ref: 'Projects'}] //Projects with access to this StorageConfig
});

StorageConfigSchema.methods.saveFile = (filename, data) => {
    switch( this.type ) {
        case 'fs':
            fs.writeFileSync(this.params['path'] + '/' + filename, data);
            break;
        default:
            break;
    }
    return;
}

mongoose.model('StorageConfig', StorageConfigSchema);
