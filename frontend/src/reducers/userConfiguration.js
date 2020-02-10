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

const uuidv4 = require('uuid/v4');
import '../actions';
import '../lib/fetch';

const userReducer = (state={}, action) => ({
    let newstate = state;
    switch(action.type) {
        case USER_CREATE_REQUEST: //Consider making this a separate state -- not directly stored in user state
            newstate = { ...state,
                isFetching: true,
                statusError: undefined,
                username: action.username,
                email: action.email,
            };
            fetchAwesomO(`/api/users/create`,
                        method='POST',
                        headers={'Content-Type': 'application/json'},
                        body={username: action.username,
                              email: action.email,
                              password: action.password})
            .then( response => response.json(),
                error => store.dispatch(userCreateError())
            )
            .then( (data) => {
                store.dispatch(userCreateSuccess());
            });
            break;
        case USER_CREATE_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case USER_CREATE_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                statusError: undefined
            };
            brea;k
        case USER_FETCH_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined,
                username: action.username
            };
            fetchAwesomOJWT(`/api/users/get/`+action.username)
            .then( response => response.json(),
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing a loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
                error => store.dispatch(userFetchError(error))
            )
            .then(json =>
                // We can dispatch many times!
                // Here, we update the app state with the results of the API call.
                store.dispatch(userFetchSuccess(json));
            );
            break;
        case USER_FETCH_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case USER_FETCH_SUCCESS:
            newstate = { ...state,
                username: action.user.username,
                email: action.user.email,
                projects: action.user.projects,
                isFetching: false
            };
            break;
        default:
            break;
    }
    return(newstate);
});

