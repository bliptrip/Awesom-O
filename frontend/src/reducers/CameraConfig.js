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
import '../lib/fetch';

const cameraConfigReducer = (state, action) => {
    let newstate = state;
    switch(action.type) {
        case CAMERA_CONFIG_CREATE_REQUEST:
            newstate = {...state,
                isFetching: true,
                statusError: undefined,
            };
            break;
        case CAMERA_CONFIG_CREATE_ERROR:
            newstate = {...state,
                isFetching: false,
                statusError: action.error,
            };
            break;
        case CAMERA_CONFIG_FETCH_REQUEST:
            newstate = {...state,
                _id: action.id,
                isFetching: true,
                statusError: undefined,
            };
            break;
        case CAMERA_CONFIG_FETCH_ERROR:
            newstate = {...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case CAMERA_CONFIG_CREATE_SUCCESS:
        case CAMERA_CONFIG_FETCH_SUCCESS:
            newstate = {...state,
                isFetching: false,
                _id: action.cameraConfig._id, //TODO - check if _id matches request
                description: action.cameraConfig.description,
                manufacturer: action.cameraConfig.manufacturer,
                model: action.cameraConfig.model,
                deviceVersion: action.cameraConfig.deviceVersion,
                sn: action.cameraConfig.sn,
                gphoto2Config: action.cameraConfig.gphoto2Config, //Hydrate the rest of the state based on the string in here
                users: action.cameraConfig.users,
                projects: action.cameraConfig.projects
            };
            break;
        case CAMERA_CONFIG_SAVE_REQUEST:
            newstate = {...state,
                isFetching: true,
                statusError: undefined
            };
            break;
        case CAMERA_CONFIG_SAVE_ERROR:
            newstate = {...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case CAMERA_CONFIG_SAVE_SUCCESS:
            newstate = {...state,
                isFetching: false,
                statusError: undefined
            };
            break;
        case CAMERA_CONFIG_REMOVE_REQUEST:
            newstate = {...state,
                isFetching: true,
                statusError: undefined
            };
            break;
        case CAMERA_CONFIG_REMOVE_ERROR:
            newstate = {...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case CAMERA_CONFIG_REMOVE_SUCCESS:
            newstate = {...state,
                isFetching: false,
                statusError: undefined
            };
            break;
        case CAMERA_CONFIG_SET_DESCRIPTION:
            newstate = {...state,
                _id: action.id,
                description: action.description
            };
            break;
        case CAMERA_CONFIG_SET_MANUFACTURER:
            newstate = {...state,
                _id: action.id,
                manufacturer: action.manufacturer
            };
            break;
        case CAMERA_CONFIG_SET_MODEL:
            newstate = {...state,
                _id: action.id,
                model: action.model
            };
            break;
        case CAMERA_CONFIG_SET_DEVICE_VERSION:
            newstate = {...state,
                _id: action.id,
                deviceVersion: action.deviceVersion
            };
            break;
        case CAMERA_CONFIG_SET_SN:
            newstate = {...state,
                _id: action.id,
                sn: action.sn
            };
            break;
        case CAMERA_CONFIG_SET_GPHOTO2_CONFIG:
            newstate = {...state,
                _id: action.id,
                gphoto2Config: action.gphoto2Config //TODO: Parse out string?
            };
            break;
        default:
            break;
    }
    return(newstate);
};

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

