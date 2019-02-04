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

const uuidv4 = require('uuid/v4');

//NOTE: I am overwriting the state rather than making a shallow copy 
const generateConfigurationEntries = (state, parentId, entry) => {
    let id = uuidv4();
    let ret = undefined;
    state[id] = {id: id, type: entry.type, parent: parentId, label: entry.label};
    switch(entry.type) {
        case 'toggle':
        case 'string':
        case 'date':
            state[id] = {...state[id], readonly: entry.readonly, value: entry.value, changed: false}
            ret = id;
            break;
        case 'choice':
            state[id] = {...state[id], readonly: entry.readonly, value: entry.value, choices: entry.choices, changed: false};
            ret = id;
            break;
        case 'section':
            //Loop through all children and generate new entries in local state
            state[id] = {...state[id], children: Object.keys(entry.children).map( (key) => generateConfigurationEntries(state, id, entry.children[key]) )};
            ret = id;
            break;
        default:
            break;
    }
    return ret;
};

const resetConfigurationChangeFlag = (entry) => {
    switch(entry.type) {
        case 'section':
            entry.children.map(child => resetConfigurationChangeFlag(child));
            break;
        case 'toggle':
        case 'string':
        case 'date':
        case 'choice':
            entry.changed = false;
            break;
        default:
            break;
    }
}


const cameraConfiguration = (state = {}, action) => {
    let newState = undefined;
    switch( action.type ) {
        case "RECEIVE_CAMERA_CONFIGURATION":
            let newEntries  = {};
            if( action.config && action.config.main ) {
                newState    = {root: generateConfigurationEntries(newEntries, undefined, action.config.main), entries: newEntries}
            }
            return newState;
        case "SET_CAMERA_ENTRY_VALUE":
            newState    = {...state};
            newState.entries = {...state.entries};
            newState.entries[action.id].value   = action.value;
            newState.entries[action.id].changed = true;
            return newState;
        case "RESET_CAMERA_CONFIGURATION_CHANGE_FLAG":
            newState    = {...state};
            newState.entries = {...state.entries};
            resetConfigurationChangeFlag(newState.entries[action.id]);
            return newState;
        default:
            return state;
    }
}

export default cameraConfiguration;

export const getCameraConfigurationEntries = config => (config);

