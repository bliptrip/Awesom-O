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
export const fetchProjectsRequest = store;

export const storage = (state = {}, action) => {
    let newstate = state;
    switch( action.type ) {
        case STORAGE_CONFIG_CREATE_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined
            };
            break;
        case STORAGE_CONFIG_CREATE_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: error
            };
            break;
        case STORAGE_CONFIG_REMOVE_REQUEST:
            newstate = {...state,
                _id: action.id,
                isFetching: true,
                statusError: undefined
            }
            break;
        case STORAGE_CONFIG_REMOVE_ERROR:
            newstate = {...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case STORAGE_CONFIG_REMOVE_SUCCESS:
            newstate = {...state,
                _id: undefined,
                isFetching: false,
                statusError: undefined
            };
            break;
        case STORAGE_CONFIG_FETCH_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined,
                _id: action.id
            };
            break;
        case STORAGE_CONFIG_FETCH_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: error
            };
            break;
        case STORAGE_CONFIG_CREATE_SUCCESS:
        case STORAGE_CONFIG_FETCH_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                _id: action.storageConfig._id, //TODO: Validate that ID returned is same as that requested
                type: action.storageConfig.type,
                params: action.storageConfig.params,
                users: action.storageConfig.users
            };
            break;
        case STORAGE_CONFIG_SAVE_REQUEST:
            newstate = { ...state,
                _id: action._id,
                areSaving: true, //TODO: Check that we aren't already processing a save or fetching request
                statusError: undefined,
            };
            break;
        case STORAGE_CONFIG_SAVE_ERROR:
            newstate = { ...state,
                areSaving: false,
                statusError: action.error };
            break;
        case STORAGE_CONFIG_SAVE_SUCCESS:
            newstate = { ...state,
                areSaving: false,
                _id: action.id };
            break;
        case STORAGE_CONFIG_SET_TYPE:
            newstate = { ...state,
                _id: action.id, //TODO - validate id is current id
                type: action.type };
            break;
        case STORAGE_CONFIG_SET_PARAMS:
            newstate = { ...state,
                _id: action.id, //TODO - validate id is current id
                params: action.params };
            break;
        default:
            break;
    }
    return(newstate);
}
