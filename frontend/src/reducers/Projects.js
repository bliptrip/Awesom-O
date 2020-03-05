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
import * as projectC from '../actions';

export const project = (state = { _id: undefined,
                                  isEditorOpen: false,
                                  isLoadDialogOpen: false,
                                  statusError: undefined,
                                  savedProjects: [] }, 
                        action) => {
    let newstate = state;
    switch( action.type ) {
        case projectC.PROJECT_CREATE_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined
            }
            break;
        case projectC.PROJECT_CREATE_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error
            }
            break;
        case projectC.PROJECT_FETCH_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined,
                _id: action.id
            };
            break;
        case projectC.PROJECT_FETCH_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case projectC.PROJECT_CREATE_SUCCESS:
        case projectC.PROJECT_FETCH_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                _id: action.project._id, //TODO: Validate that ID returned is same as that requested
                description: action.project.description,
                shortDescription: action.project.shortDescription,
                cameraConfig: action.project.cameraConfig,
                experimentConfig: action.project.experimentConfig,
                storageConfigs: action.project.storageConfigs,
                routeConfig: action.project.routeConfig,
                users: action.project.users
            };
            break;
        case projectC.PROJECT_REMOVE_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined,
                _id: action.id
            };
            break;
        case projectC.PROJECT_REMOVE_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case projectC.PROJECT_REMOVE_SUCCESS:
            newstate = { ...state,
                isFetching: false,
            };
            break;
        case projectC.PROJECT_SAVE_REQUEST:
            newstate = { ...state,
                areSaving: true, //TODO: Check that we aren't already processing a save or fetching request
                statusError: undefined,
            };
            break;
        case projectC.PROJECT_SAVE_ERROR:
            newstate = { ...state,
                areSaving: false, //TODO: Check that we aren't already processing a save or fetching request
                statusError: action.error
            };
            break;
        case projectC.PROJECT_SAVE_SUCCESS:
            newstate = { ...state,
                areSaving: false, //TODO: Check that we aren't already processing a save or fetching request
                _id: action._id
            };
            break;
        case projectC.PROJECT_SET_SHORT:
            newstate = { ...state,
                shortDescription: action.shortDescription
            };
            break;
        case projectC.PROJECT_SET_DESCRIPTION:
            newstate = { ...state,
                description: action.description
            };
            break;
        case projectC.PROJECT_SET_EDITOR_OPEN:
            newstate = { ...state,
                isEditorOpen: action.isEditorOpen
            };
            break;
        case projectC.PROJECT_SET_LOAD_DIALOG_OPEN:
            newstate = { ...state,
                isLoadDialogOpen: action.isLoadDialogOpen
            };
            break;
        case projectC.PROJECT_SET_CAMERA_CONFIG:
            newstate = { ...state,
                cameraConfig: {_id: action.cameraId}
            };
            break;
        case projectC.PROJECT_SET_EXPERIMENT_CONFIG:
            newstate = { ...state,
                experimentConfig: {_id: action.experimentId}
            };
            break;
        case projectC.PROJECT_SET_ROUTE_CONFIG:
            newstate = { ...state,
                routeConfig: {_id: action.routeId}
            };
            break;
        case projectC.PROJECT_ADD_STORAGE_CONFIG:
            newstate = { ...state };
            newstate.storageConfigs = [ ...newstate.storageConfigs ]; /* Make a copy */
            newstate.storageConfigs.push({_id: action.storageId});
            break;
        case projectC.PROJECT_REMOVE_STORAGE_CONFIG:
            newstate = { ...state,
                        storageConfigs: state.storageConfigs.filter( sid => (sid._id !== action.storageId) ) }; //Not the most efficient way to remove an element from an array?
            break;
        case projectC.PROJECT_CLEAR_STORAGE_CONFIGS:
            newstate = { ...state,
                        storageConfigs: [] }; //Not the most efficient way to remove an element from an array?
            break;
        case projectC.PROJECT_LOAD_SAVED_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined,
                savedProjects: []
            };
            break;
        case projectC.PROJECT_LOAD_SAVED_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case projectC.PROJECT_LOAD_SAVED_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                statusError: undefined,
                savedProjects: action.savedProjects
            };
            break;
        default:
            break;
    }
    return(newstate);
}
