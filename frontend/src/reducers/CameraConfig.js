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

import * as cameraC from '../actions';
import {generateConfigurationEntries,resetConfigurationStaleFlag} from '../lib/camera';

const initState = {
    _id: undefined,
    isEditorOpen: false,
    isLoadDialogOpen: false,
    isFetching: false,
    statusError: undefined,
    description: "",
    shortDescription: "",
    manufacturer: "",
    model: "",
    deviceVersion: "",
    sn: "",
    config: undefined,
    users: [],
    projects: [],
    savedCameraConfigs: [],
    rootid: undefined,
    configs: {}
}

export const cameraConfigReducer = (state = initState, action) => {
    let newstate = state;
    let config;
    let configs;
    let rootid;
    switch(action.type) {
        case cameraC.CAMERA_CONFIG_INIT:
            newstate = {...initState};
            break;
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
            configs = {};
            newstate = {...state};
            if( action.cameraConfig.gphoto2Config && (action.cameraConfig.gphoto2Config !== "") ) {
                rootid = generateConfigurationEntries(configs, undefined, 'main', JSON.parse(action.cameraConfig.gphoto2Config).main);
                newstate.rootid = rootid;
                newstate.configs = configs;
            }
            newstate = { ...newstate,
                isFetching: false,
                _id: action.cameraConfig._id, //TODO - check if _id matches request
                shortDescription: action.cameraConfig.shortDescription,
                description: action.cameraConfig.description,
                manufacturer: action.cameraConfig.manufacturer,
                model: action.cameraConfig.model,
                deviceVersion: action.cameraConfig.deviceVersion,
                sn: action.cameraConfig.sn,
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
                _id: action._id,
                isFetching: false,
                statusError: undefined
            };
            break;
        case cameraC.CAMERA_CONFIG_LOAD_SAVED_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined,
                savedCameraConfigs: []
            };
            break;
        case cameraC.CAMERA_CONFIG_LOAD_SAVED_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case cameraC.CAMERA_CONFIG_LOAD_SAVED_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                statusError: undefined,
                savedCameraConfigs: action.cameraConfigs
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
        case cameraC.CAMERA_CONFIG_SET_SHORT:
            newstate = {...state,
                shortDescription: action.shortDescription
            };
            break;
        case cameraC.CAMERA_CONFIG_SET_DESCRIPTION:
            newstate = {...state,
                description: action.description
            };
            break;
        case cameraC.CAMERA_CONFIG_SET_MANUFACTURER:
            newstate = {...state,
                manufacturer: action.manufacturer
            };
            break;
        case cameraC.CAMERA_CONFIG_SET_MODEL:
            newstate = {...state,
                model: action.model
            };
            break;
        case cameraC.CAMERA_CONFIG_SET_DEVICE_VERSION:
            newstate = {...state,
                deviceVersion: action.deviceVersion
            };
            break;
        case cameraC.CAMERA_CONFIG_SET_SN:
            newstate = {...state,
                sn: action.sn
            };
            break;
        case cameraC.CAMERA_CONFIG_SET_EDITOR_OPEN:
            newstate    = {...state,
                isEditorOpen: action.isEditorOpen 
            };
            break;
        case cameraC.CAMERA_CONFIG_SET_LOAD_DIALOG_OPEN:
            newstate    = {...state,
                isLoadDialogOpen: action.isLoadDialogOpen
            };
            break;
        case cameraC.CAMERA_CONFIG_SET_ENTRY_VALUE:
            newstate                                     = {...state};
            newstate.configs                             = {...newstate.configs};
            config                                       = newstate.configs[action.id];
            newstate.configs[action.id]                  = { ...config,
                                                             stale: true
            };
            newstate.configs[action.id].entry            = {...config.entry};
            newstate.configs[action.id].entry.value      = action.value; 
            break;
        case cameraC.CAMERA_CONFIG_RESET_STALE_FLAG:
            newstate    = {...state};
            newstate.configs = {...newstate.configs};
            action.ids.forEach( id => resetConfigurationStaleFlag(newstate.configs, id) );
            break;
        case cameraC.CAMERA_CONFIG_LOAD_SETTINGS_REQUEST:
            newstate    = { ...state,
                            isFetching: true,
                            statusError: undefined
                          };
            break;
        case cameraC.CAMERA_CONFIG_LOAD_SETTINGS_ERROR:
            newstate    = { ...state,
                            isFetching: false,
                            statusError: action.error
                          };
            break;
        case cameraC.CAMERA_CONFIG_LOAD_SETTINGS_SUCCESS:
            configs = {};
            rootid = generateConfigurationEntries(configs, undefined, 'main', action.settings.main);
            newstate    = { ...state,
                            isFetching: false,
                            statusError: undefined,
                            configs,
                            rootid
                          };
            break;
        case cameraC.CAMERA_CONFIG_APPLY_SETTINGS_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        statusError: undefined};
            break;
        case cameraC.CAMERA_CONFIG_APPLY_SETTINGS_ERROR:
            newstate = {...state,
                        isFetching: false,
                        statusError: action.error};
            break;
        case cameraC.CAMERA_CONFIG_APPLY_SETTINGS_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        statusError: undefined};
            break;
        case cameraC.CAMERA_CAPTURE_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        statusError: undefined};
            break;
        case cameraC.CAMERA_CAPTURE_ERROR:
            newstate = {...state,
                        isFetching: false,
                        statusError: action.error};
            break;
        case cameraC.CAMERA_CAPTURE_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        statusError: undefined};
            break;
        default:
            break;
    }
    return(newstate);
};
