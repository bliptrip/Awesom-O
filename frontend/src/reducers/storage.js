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
        case STORAGE_CONFIG_FETCH_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined,
                _id: action.id
            };
            fetchAwesomeOJWT(`/api/storage/get/`+action.id)
            .then( response => response.json(),
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing a loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
                error => store.dispatch(storageConfigFetchError(error));
            )
            .then(json =>
                // We can dispatch many times!
                // Here, we update the app state with the results of the API call.
                store.dispatch(storageConfigFetchSuccess(json));
            );
            break;
        case STORAGE_CONFIG_FETCH_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: error
            };
            break;
        case STORAGE_CONFIG_FETCH_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                _id: action.storageConfig._id, //TODO: Validate that ID returned is same as that requested
                type: action.storageConfig.type,
                params: action.storageConfig.params
            };
            break;
        case STORAGE_CONFIG_SAVE_REQUEST:
            newstate = { ...state,
                areSaving: true, //TODO: Check that we aren't already processing a save or fetching request
                statusError: undefined,
                _id: action.storageConfig._id
            };
            fetchAwesomOJWT('/api/storages/save/'+action.storageConfig._id, method='POST', body=action.storageConfig)
            .then(  response => response.json(),
                    error => store.dispatch(storageSaveError(error)) )
            .then(json => store.dispatch(storageSaveSuccess(json.id)))
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
