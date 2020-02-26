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

import '../lib/fetch';
import * as cameraC from '../actions';

const uuidv4 = require('uuid/v4');

//NOTE: I am overwriting the state rather than making a shallow copy 
const generateConfigurationEntries = (state, parentId, entry) => {
    let id = uuidv4();
    let ret = undefined;
    state[id] = {id: id, parent: parentId, entry: entry, stale: true};
    switch(entry.type) {
        case 'toggle':
        case 'string':
        case 'date':
        case 'choice':
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

const resetConfigurationStaleFlag = (configs,id) => {
    let config = {...configs[id]};
    switch(config.entry.type) {
        case 'section':
            config.stale = false;
            config.children.map((cid) => resetConfigurationStaleFlag(configs,cid));
            break;
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

export const cameraConfigReducer = (state = {
        _id: undefined,
        isEditorOpen: false,
        isFetching: false,
        statusError: undefined,
        description: "",
        manufacturer: "",
        model: "",
        deviceVersion: "",
        sn: "",
        gphoto2Config: "",
        config: undefined,
        users: [],
        projects: []
    }, action) => {
    let newstate = state;
    switch(action.type) {
        case cameraC.CAMERA_CONFIG_CREATE_REQUEST:
            newstate = {...state,
                isFetching: true,
                statusError: undefined,
            };
            break;
        case cameraC.CAMERA_CONFIG_CREATE_ERROR:
            newstate = {...state,
                isFetching: false,
                statusError: action.error,
            };
            break;
        case cameraC.CAMERA_CONFIG_FETCH_REQUEST:
            newstate = {...state,
                _id: action.id,
                isFetching: true,
                statusError: undefined,
            };
            break;
        case cameraC.CAMERA_CONFIG_FETCH_ERROR:
            newstate = {...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case cameraC.CAMERA_CONFIG_CREATE_SUCCESS:
        case cameraC.CAMERA_CONFIG_FETCH_SUCCESS:
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
        case cameraC.CAMERA_CONFIG_SAVE_REQUEST:
            newstate = {...state,
                isFetching: true,
                statusError: undefined
            };
            break;
        case cameraC.CAMERA_CONFIG_SAVE_ERROR:
            newstate = {...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case cameraC.CAMERA_CONFIG_SAVE_SUCCESS:
            newstate = {...state,
                isFetching: false,
                statusError: undefined
            };
            break;
        case cameraC.CAMERA_CONFIG_REMOVE_REQUEST:
            newstate = {...state,
                isFetching: true,
                statusError: undefined
            };
            break;
        case cameraC.CAMERA_CONFIG_REMOVE_ERROR:
            newstate = {...state,
                isFetching: false,
                statusError: action.error 
            };
            break;
        case cameraC.CAMERA_CONFIG_REMOVE_SUCCESS:
            newstate = {...state,
                isFetching: false,
                statusError: undefined
            };
            break;
        case cameraC.CAMERA_CONFIG_SET_DESCRIPTION:
            newstate = {...state,
                _id: action.id,
                description: action.description
            };
            break;
        case cameraC.CAMERA_CONFIG_SET_MANUFACTURER:
            newstate = {...state,
                _id: action.id,
                manufacturer: action.manufacturer
            };
            break;
        case cameraC.CAMERA_CONFIG_SET_MODEL:
            newstate = {...state,
                _id: action.id,
                model: action.model
            };
            break;
        case cameraC.CAMERA_CONFIG_SET_DEVICE_VERSION:
            newstate = {...state,
                _id: action.id,
                deviceVersion: action.deviceVersion
            };
            break;
        case cameraC.CAMERA_CONFIG_SET_SN:
            newstate = {...state,
                _id: action.id,
                sn: action.sn
            };
            break;
        case cameraC.CAMERA_CONFIG_SET_GPHOTO2_CONFIG:
            let configs = {};
            let rootid = generateConfigurationEntries(configs, undefined, JSON.parse(action.gphoto2Config).main);
            newstate = {...state,
                _id: action.id,
                gphoto2Config: action.gphoto2Config,
                configs,
                rootid
            };
            break;
        case cameraC.CAMERA_CONFIG_SET_EDITOR_OPEN:
            newstate    = {...state,
                isEditorOpen: action.isEditorOpen 
            };
            break;
        case cameraC.CAMERA_CONFIG_SET_ENTRY_VALUE:
            newstate                                     = {...state};
            newstate.configs                             = {...newstate.configs};
            let config                                   = newstate.configs[action.id];
            newstate.configs[action.id]                  = { ...config,
                                                             stale: true
            };
            newstate.configs[action.id].entry            = {...config.entry};
            newstate.configs[action.id].entry.value      = action.value; 
            break;
        case cameraC.CAMERA_CONFIG_RESET_STALE_FLAG:
            newstate    = {...state};
            newstate.configs = {...newstate.configs};
            resetConfigurationStaleFlag(newstate.configs, action.id);
            break;
        default:
            break;
    }
    return(newstate);
};
