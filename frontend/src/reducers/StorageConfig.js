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
import * as storageC from '../actions';

export const storage = (state = {isStale: false,
                                 isEditorOpen: false, 
                                 isLoadDialogOpen: false,
                                 isFetching: false,
                                 areSaving: false,
                                 statusError: undefined,
                                 savedStorageConfigs: [],
                                 supportedTypes: [], 
                                 supportedParams: {},
                                 storageType: "",
                                 params: {}}, 
                        action) => {
    let newstate = state;
    switch( action.type ) {
        case storageC.STORAGE_CONFIG_CREATE_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined
            };
            break;
        case storageC.STORAGE_CONFIG_CREATE_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case storageC.STORAGE_CONFIG_REMOVE_REQUEST:
            newstate = {...state,
                isFetching: true,
                statusError: undefined
            }
            break;
        case storageC.STORAGE_CONFIG_REMOVE_ERROR:
            newstate = {...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case storageC.STORAGE_CONFIG_REMOVE_SUCCESS:
            newstate = {...state,
                _id: undefined,
                isFetching: false,
                statusError: undefined
            };
            break;
        case storageC.STORAGE_CONFIG_FETCH_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined,
                _id: action.id
            };
            break;
        case storageC.STORAGE_CONFIG_FETCH_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case storageC.STORAGE_CONFIG_CREATE_SUCCESS:
        case storageC.STORAGE_CONFIG_FETCH_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                _id: action.storageConfig._id, //TODO: Validate that ID returned is same as that requested
                shortDescription: action.storageConfig.shortDescription,
                storageType: action.storageConfig.storageType,
                params: action.storageConfig.params,
                users: action.storageConfig.users,
                projects: action.storageConfig.projects
            };
            break;
        case storageC.STORAGE_CONFIG_SET_SHORT:
            newstate = {...state,
                shortDescription: action.shortDescription
            };
            break;
        case storageC.STORAGE_CONFIG_SAVE_REQUEST:
            newstate = { ...state,
                areSaving: true, //TODO: Check that we aren't already processing a save or fetching request
                statusError: undefined,
            };
            break;
        case storageC.STORAGE_CONFIG_SAVE_ERROR:
            newstate = { ...state,
                areSaving: false,
                statusError: action.error 
            };
            break;
        case storageC.STORAGE_CONFIG_SAVE_SUCCESS:
            newstate = { ...state,
                areSaving: false,
            };
            break;
        case storageC.STORAGE_CONFIG_LOAD_SAVED_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined,
                savedStorageConfigs: []
            };
            break;
        case storageC.STORAGE_CONFIG_LOAD_SAVED_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case storageC.STORAGE_CONFIG_LOAD_SAVED_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                statusError: undefined,
                savedStorageConfigs: action.storageConfigs
            };
            break;
        case storageC.STORAGE_CONFIG_SET_EDITOR_OPEN:
            newstate = { ...state,
                isEditorOpen: action.isEditorOpen };
            break;
        case storageC.STORAGE_CONFIG_SET_LOAD_DIALOG_OPEN:
            newstate    = {...state,
                isLoadDialogOpen: action.isLoadDialogOpen
            };
            break;
        case storageC.STORAGE_CONFIG_GET_SUPPORTED_TYPES_REQUEST:
            newstate = { ...state,
                isFetching: true, //TODO: Check that we aren't already processing a save or fetching request
                statusError: undefined,
            };
            break;
        case storageC.STORAGE_CONFIG_GET_SUPPORTED_TYPES_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error 
            };
            break;
        case storageC.STORAGE_CONFIG_GET_SUPPORTED_TYPES_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                statusError: undefined,
                supportedTypes: action.supportedTypes
            };
            break;
        case storageC.STORAGE_CONFIG_GET_SUPPORTED_PARAMS_REQUEST:
            newstate = { ...state,
                isFetching: true, //TODO: Check that we aren't already processing a save or fetching request
                statusError: undefined,
            };
            break;
        case storageC.STORAGE_CONFIG_GET_SUPPORTED_PARAMS_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error 
            };
            break;
        case storageC.STORAGE_CONFIG_GET_SUPPORTED_PARAMS_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                statusError: undefined,
                supportedParams: action.supportedParams
            };
            break;
        case storageC.STORAGE_CONFIG_SET_TYPE:
            newstate = { ...state,
                storageType: action.storageType };
            break;
        case storageC.STORAGE_CONFIG_SET_PARAMS:
            newstate = { ...state,
                params: action.params };
            break;
        default:
            break;
    }
    return(newstate);
}
