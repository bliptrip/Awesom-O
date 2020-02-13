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
        case USER_LOGIN_REQUEST: //Consider making this a separate state -- not directly stored in user state
            newstate = { ...state,
                isFetching: true,
                statusError: undefined,
                _id: undefined,
                username: action.username,
                email: action.email,
                password: action.password
            };
            fetchAwesomO(`/api/users/login`,
                        method='POST',
                        headers={'Content-Type': 'application/json'},
                        body={username: newstate.username,
                              email: newstate.email,
                              password: newstate.password})
            .then( response => response.json(),
                error => store.dispatch(userLoginError(error))
            )
            .then( (data) => {
                store.dispatch(userLoginSuccess(data));
            });
            break;
        case USER_LOGIN_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error,
                _id: undefined
            };
            break;
        case USER_LOGIN_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                statusError: undefined
                _id: action.user._id,
                projects: action.user.projects
            };
            break;
        case USER_CREATE_REQUEST: //Consider making this a separate state -- not directly stored in user state
            newstate = { ...state,
                isFetching: true,
                statusError: undefined
            };
            fetchAwesomO(`/api/users/create`,
                        method='POST',
                        headers={'Content-Type': 'application/json'},
                        body={username: newstate.username,
                              email: newstate.email,
                              password: newstate.password})
            .then( response => response.json(),
                error => store.dispatch(userCreateError(error))
            )
            .then( (data) => {
                store.dispatch(userCreateSuccess(data));
            });
            break;
        case USER_CREATE_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error,
                _id: undefined
            };
            break;
        case USER_CREATE_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                statusError: undefined,
                _id: action.user._id,
                projects: action.user.projects
            };
            break;
        case USER_FETCH_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined
            };
            fetchAwesomOJWT(`/api/users/get/`+newstate.username)
            .then( response => response.json(),
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing a loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
                error => store.dispatch(userFetchError(error))
            )
            .then(data =>
                // We can dispatch many times!
                // Here, we update the app state with the results of the API call.
                store.dispatch(userFetchSuccess(data));
            );
            break;
        case USER_FETCH_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error,
                _id: undefined
            };
            break;
        case USER_FETCH_SUCCESS:
            newstate = { ...state,
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

