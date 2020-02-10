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
const uuidv4 = require('uuid/v4');

const experimentConfigReducer = (state, action) => {
    let newstate = state;
    switch(action.type) {
        case EXPERIMENT_CONFIG_REQUEST:
            newstate = {...state,
                isFetching: true,
                statusError: undefined,
                _id: action.id
            };
            fetchAwesomOJWT('/api/experiment/get/'+action.id)
            .then(response => response.json(),
                  error => store.dispatch(experimentConfigError(error)))
            .then( json => store.dispatch(experimentConfigSuccess(json));
            break;
        case EXPERIMENT_CONFIG_ERROR:
            newstate = {...state,
                isFetching: false,
                statusError: action.error,
            };
            break;
        case EXPERIMENT_CONFIG_SUCCESS:
            newstate = {...state,
                isFetching: false,
                _id: action.experimentConfig._id, //TODO - check if _id matches request
                datetime: action.experimentConfig.datetime,
                rename: action.experimentConfig.rename,
                imageMeta: action.experimentConfig.imageMeta,
                filenameFields: action.experimentConfig.filenameFields,
                plateMeta: action.experimentConfig.plateMeta
            };
            break;
        case EXPERIMENT_CONFIG_SET_DATETIME:
            newstate = {...state,
                _id: action.id,
                datetime: action.datetime
            };
            break;
        case EXPERIMENT_CONFIG_SET_RENAME:
            newstate = {...state,
                _id: action.id,
                rename: action.rename
            };
            break;
        case EXPERIMENT_CONFIG_SET_IMAGE_META:
            newstate = {...state,
                _id: action.id,
                imageMeta: action.imageMeta
            };
            break;
        case EXPERIMENT_CONFIG_SET_FILENAME_FIELDS:
            newstate = {...state,
                _id: action.id,
                filenameFields: action.filenameFields
            };
            break;
        case EXPERIMENT_CONFIG_ADD_PLATE:
            newstate = {...state,
                _id: action.id,
            };
            newstate.plateMeta.push({
                row: action.row,
                col: action.col,
                meta: action.meta
            });
            break;
        case EXPERIMENT_CONFIG_REMOVE_PLATE:
            newstate = {...state,
                _id: action.id
            };
            newstate.plateMeta = newstate.plateMeta.filter((e) => ((e.row != action.row) && (e.col != action.col))); //Remove by exclusion -- could be optimized
            break;
        case EXPERIMENT_CONFIG_SAVE_REQUEST:
            newstate = { ...state,
                areSaving: true, //TODO: Check that we aren't already processing a save or fetching request
                statusError: undefined,
                _id: action.experimentConfig._id
            };
            fetchAwesomOJWT('/api/experiment/save/', method='POST', body=action.experimentConfig)
            .then(  response => response.json(),
                    error => store.dispatch(experimentConfigError(error)) )
            .then(json => store.dispatch(experimentConfigSuccess(json.id)))
            break;
        case EXPERIMENT_CONFIG_SAVE_ERROR:
            newstate = { ...state,
                areSaving: false,
                statusError: action.error };
            break;
        case EXPERIMENT_CONFIG_SAVE_SUCCESS:
            newstate = { ...state,
                areSaving: false,
                _id: action.id };
            break;
        default:
            break;
    }
    return(newstate);
};
