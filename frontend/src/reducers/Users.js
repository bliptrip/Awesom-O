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
                _id: undefined,
                username: action.username,
                isFetching: true,
                statusError: undefined,
            };
            break;
        case USER_LOGIN_ERROR:
            newstate = { ...state,
                username: undefined,
                isFetching: false,
                statusError: action.error
            };
            break;
        case USER_LOGIN_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                statusError: undefined,
                _id: action.user._id,
                username: action.user.username,
                email: action.user.email,
                token: action.user.token,
            };
            break;
        case USER_CREATE_REQUEST: //Consider making this a separate state -- not directly stored in user state
            newstate = { ...state,
                _id: undefined,
                isFetching: true,
                statusError: undefined,
            };
            break;
        case USER_CREATE_ERROR:
            newstate = { ...state,
                _id: undefined,
                isFetching: false,
                statusError: action.error
            };
            break;
        case USER_CREATE_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                statusError: undefined
            };
            break;
        case USER_REMOVE_REQUEST:
            newstate = { ...state,
                _id: action._id,
                isFetching: true,
                statusError: undefined,
            };
            break;
        case USER_REMOVE_ERROR:
            newstate = { ...state,
                _id: undefined,
                isFetching: false,
                statusError: action.error
            };
            break;
        case USER_REMOVE_SUCCESS:
            newstate = { ...state,
                _id: undefined,
                isFetching: false,
                statusError: undefined
            };
            break;
        case USER_CHANGEPASSWORD_REQUEST:
            newstate = { ...state,
                _id: action._id,
                isFetching: true,
                statusError: undefined,
            };
            break;
        case USER_CHANGEPASSWORD_ERROR:
            newstate = { ...state,
                _id: undefined,
                isFetching: false,
                statusError: action.error
            };
            break;
        case USER_CHANGEPASSWORD_SUCCESS:
            newstate = { ...state,
                _id: undefined,
                isFetching: false,
                statusError: undefined
            };
            break;
        case USER_FETCH_REQUEST:
            newstate = { ...state,
                username: action.username,
                isFetching: true,
                statusError: undefined
            };
            break;
        case USER_FETCH_ERROR:
            newstate = { ...state,
                _id: undefined,
                username: undefined,
                isFetching: false,
                statusError: action.error
            };
            break;
        case USER_FETCH_SUCCESS:
            newstate = { ...state,
                _id: action.user._id,
                username: action.user.username,
                email: action.user.email,
                isFetching: false,
                statusError: undefined
            };
            break;
        default:
            break;
    }
    return(newstate);
});

