/**************************************************************************************
This file is part of Awesom-O, an image acquisition and analysis web application,
consisting of a frontend web interface and a backend database, camera, and motor access
management framework.

Copyright (C)  2020  Andrew F. Maule

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

const uuidv4 = require('uuid/v4');

export const cameraSettings2Gphoto2Config = (configs, id) => {
    let ret = undefined;
    let config = configs[id];
    switch(config.entry.type) {
        case 'section':
            //Loop through all children and generate new entries in local state
            let children = {}
            config.children.forEach( (cid) => {children[configs[cid].keyId] = cameraSettings2Gphoto2Config(configs,cid)} );
            config.entry.children = children;
        case 'toggle':
        case 'string':
        case 'date':
        case 'choice':
            ret = config.entry;
            break;
        default:
            break;
    }
    return ret;
    
};

//NOTE: I am overwriting the state rather than making a shallow copy 
export const generateConfigurationEntries = (state, parentId, keyId, entry) => {
    let id = uuidv4();
    let ret = undefined;
    state[id] = {id: id, keyId: keyId, parent: parentId, entry: entry, stale: false};
    switch(entry.type) {
        case 'section':
            //Loop through all children and generate new entries in local state
            state[id].children = Object.keys(entry.children).map ( (key) => generateConfigurationEntries(state, id, key, entry.children[key]));
        case 'toggle':
        case 'string':
        case 'date':
        case 'choice':
            ret = id;
            break;
        default:
            break;
    }
    return ret;
};

export const resetConfigurationStaleFlag = (configs,id) => {
    let config = {...configs[id]};
    switch(config.entry.type) {
        case 'section':
            config.children.map((cid) => resetConfigurationStaleFlag(configs,cid));
        case 'toggle':
        case 'string':
        case 'date':
        case 'choice':
            config.stale = false;
            break;
        default:
            break;
    }
    configs[id] = config;
}
