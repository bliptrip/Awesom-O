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

const project = (state = {}, action) => {
    let newstate = state;
    switch( action.type ) {
        case PROJECT_CREATE_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined
            }
            break;
        case PROJECT_CREATE_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error
            }
            break;
        case PROJECT_FETCH_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined,
                _id: action.id
            };
            break;
        case PROJECT_FETCH_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: error
            };
            break;
        case PROJECT_CREATE_SUCCESS:
        case PROJECT_FETCH_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                _id: action.project._id, //TODO: Validate that ID returned is same as that requested
                description: action.project.description,
                cameraConfig: action.project.cameraConfig,
                experimentConfig: action.project.experimentConfig,
                storageConfigs: action.project.storageConfigs,
                routeConfig: action.project.routeConfig,
                users: action.project.users
            };
            break;
        case PROJECT_REMOVE_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined,
                _id: action.id
            };
            break;
        case PROJECT_REMOVE_ERROR:
            ewstate = { ...state,
                isFetching: false,
                statusError: error
            };
            break;
        case PROJECT_REMOVE_SUCCESS:
            newstate = { ...state,
                isFetching: false,
            };
            break;
        case PROJECT_SAVE_REQUEST:
            newstate = { ...state,
                areSaving: true, //TODO: Check that we aren't already processing a save or fetching request
                statusError: undefined,
                _id: action.project._id
            };
            break;
        case PROJECT_SAVE_ERROR:
            newstate = { ...state,
                areSaving: false, //TODO: Check that we aren't already processing a save or fetching request
                statusError: action.error
            };
            break;
        case PROJECT_SAVE_SUCCESS:
            newstate = { ...state,
                _id: action.id,
                areSaving: false //TODO: Check that we aren't already processing a save or fetching request
            };
            break;
