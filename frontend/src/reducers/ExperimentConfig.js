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
import * as experimentC from '../actions';

export const experiment = (state = { 
        _id: undefined,
        isEditorOpen: false,
        isLoadDialogOpen: false,
        isFetching: false,
        statusError: undefined,
        shortDescription: "",
        datetime: false,
        rename: false,
        imageMeta: false,
        filenameFields: [],
        plateMeta: [],
        users: [],
        projects: [],
        savedExperimentConfigs: []
    }, action) => {
    let newstate = state;
    switch(action.type) {
        case experimentC.EXPERIMENT_CONFIG_CREATE_REQUEST:
            newstate = {...state,
                isFetching: true,
                statusError: undefined
            }
            break;
        case experimentC.EXPERIMENT_CONFIG_CREATE_ERROR:
            newstate = {...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case experimentC.EXPERIMENT_CONFIG_REMOVE_REQUEST:
            newstate = {...state,
                _id: action.id,
                isFetching: true,
                statusError: undefined
            }
            break;
        case experimentC.EXPERIMENT_CONFIG_REMOVE_ERROR:
            newstate = {...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case experimentC.EXPERIMENT_CONFIG_REMOVE_SUCCESS:
            newstate = {...state,
                _id: undefined,
                isFetching: false,
                statusError: undefined
            };
            break;
        case experimentC.EXPERIMENT_CONFIG_SET_SHORT:
            newstate = {...state,
                shortDescription: action.shortDescription
            };
            break;
        case experimentC.EXPERIMENT_CONFIG_FETCH_REQUEST:
            newstate = {...state,
                isFetching: true,
                statusError: undefined,
                _id: action._id
            };
            break;
        case experimentC.EXPERIMENT_CONFIG_FETCH_ERROR:
            newstate = {...state,
                isFetching: false,
                statusError: action.error,
            };
            break;
        case experimentC.EXPERIMENT_CONFIG_CREATE_SUCCESS:
        case experimentC.EXPERIMENT_CONFIG_FETCH_SUCCESS:
            newstate = {...state,
                isFetching: false,
                _id: action.experimentConfig._id, //TODO - check if _id matches request
                shortDescription: action.experimentConfig.shortDescription,
                datetime: action.experimentConfig.datetime,
                rename: action.experimentConfig.rename,
                imageMeta: action.experimentConfig.imageMeta,
                filenameFields: action.experimentConfig.filenameFields,
                plateMeta: action.experimentConfig.plateMeta,
                users: action.experimentConfig.users,
                projects: action.experimentConfig.projects
            };
            break;
        case experimentC.EXPERIMENT_CONFIG_SET_DATETIME:
            newstate = {...state,
                datetime: action.datetime
            };
            break;
        case experimentC.EXPERIMENT_CONFIG_SET_RENAME:
            newstate = {...state,
                rename: action.rename
            };
            break;
        case experimentC.EXPERIMENT_CONFIG_SET_IMAGE_META:
            newstate = {...state,
                imageMeta: action.imageMeta
            };
            break;
        case experimentC.EXPERIMENT_CONFIG_SET_FILENAME_FIELDS:
            newstate = {...state,
                filenameFields: action.filenameFields
            };
            break;
        case experimentC.EXPERIMENT_CONFIG_ADD_FILENAME_FIELD:
            newstate = {...state};
            newstate.filenameFields = [...newstate.filenameFields];
            newstate.filenameFields.push(action.field);
            break;
        case experimentC.EXPERIMENT_CONFIG_REMOVE_FILENAME_FIELD:
            newstate = {...state};
            newstate.filenameFields = newstate.filenameFields.filter((f) => (f !== action.field)); //Remove by exclusion -- could be optimized
            break;
        case experimentC.EXPERIMENT_CONFIG_CLEAR_FILENAME_FIELDS:
            newstate = {...state};
            newstate.filenameFields = [];
            break;
        case experimentC.EXPERIMENT_CONFIG_ADD_PLATE:
            newstate = {...state};
            newstate.plateMeta = [...newstate.plateMeta];
            newstate.plateMeta.push({
                row: action.row,
                col: action.col,
                meta: action.meta
            });
            break;
        case experimentC.EXPERIMENT_CONFIG_REMOVE_PLATE:
            newstate = {...state};
            newstate.plateMeta = newstate.plateMeta.filter((e) => ((e.row !== action.row) && (e.col !== action.col))); //Remove by exclusion -- could be optimized
            break;
        case experimentC.EXPERIMENT_CONFIG_CLEAR_PLATE_META:
            newstate = {...state};
            newstate.plateMeta = [];
            break;
        case experimentC.EXPERIMENT_CONFIG_SAVE_REQUEST:
            newstate = { ...state,
                areSaving: true, //TODO: Check that we aren't already processing a save or fetching request
                statusError: undefined };
            break;
        case experimentC.EXPERIMENT_CONFIG_SAVE_ERROR:
            newstate = { ...state,
                areSaving: false,
                statusError: action.error };
            break;
        case experimentC.EXPERIMENT_CONFIG_SAVE_SUCCESS:
            newstate = { ...state,
                areSaving: false };
            break;
        case experimentC.EXPERIMENT_CONFIG_LOAD_SAVED_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined,
                savedExperimentConfigs: []
            };
            break;
        case experimentC.EXPERIMENT_CONFIG_LOAD_SAVED_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case experimentC.EXPERIMENT_CONFIG_LOAD_SAVED_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                statusError: undefined,
                savedExperimentConfigs: action.experimentConfigs
            };
            break;
        case experimentC.EXPERIMENT_CONFIG_SET_EDITOR_OPEN:
            newstate = { ...state,
                isEditorOpen: action.isEditorOpen };
            break;
        case experimentC.EXPERIMENT_CONFIG_SET_LOAD_DIALOG_OPEN:
            newstate    = {...state,
                isLoadDialogOpen: action.isLoadDialogOpen
            };
            break;
        default:
            break;
    }
    return(newstate);
};
