/**************************************************************************************
This file is part of Awesom-O, an image acquisition and analysis web application,
consisting of a frontend web interface and a backend database, camera, and motor access
management framework.

Copyright (C)  2019  Andrew F. Maule

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
import * as ctrlC from '../actions';

const controller = (state = {currentUserId: undefined,
                             currentProjectId: undefined,
                             status: ctrlC.CONTROLLER_RUNNING_STATUS_STOPPED,
                             location: {},
                             isFetching: false,
                             statusError: undefined
                            }, action) => {
    let newstate = state;
    switch( action.type ) {
        case ctrlC.CONTROLLER_SET_RUNNING_STATUS:
            newstate = {...state,
                        status: action.status,
                        currentUserId: action.userId};
            break;
        case ctrlC.CONTROLLER_SET_LOCATION:
            newstate = {...state,
                        location: action.location};
            break;
        case ctrlC.CONTROLLER_MOVE_PLATE_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        statusError: undefined};
            break;
        case ctrlC.CONTROLLER_MOVE_PLATE_ERROR:
            newstate = {...state,
                        isFetching: false,
                        statusError: action.error};
            break;
        case ctrlC.CONTROLLER_MOVE_PLATE_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        statusError: undefined,
                        location: action.location};
            break;
        case ctrlC.CONTROLLER_MOVE_DISTANCE_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        statusError: undefined};
            break;
        case ctrlC.CONTROLLER_MOVE_DISTANCE_ERROR:
            newstate = {...state,
                        isFetching: false,
                        statusError: action.error};
            break;
        case ctrlC.CONTROLLER_MOVE_DISTANCE_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        statusError: undefined,
                        location: action.location};
            break;
        case ctrlC.CONTROLLER_MOVE_HOME_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        statusError: undefined};
            break;
        case ctrlC.CONTROLLER_MOVE_HOME_ERROR:
            newstate = {...state,
                        isFetching: false,
                        statusError: action.error};
            break;
        case ctrlC.CONTROLLER_MOVE_HOME_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        statusError: undefined,
                        location: action.location};
            break;
        case ctrlC.CONTROLLER_SET_USER_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        statusError: undefined};
            break;
        case ctrlC.CONTROLLER_SET_USER_ERROR:
            newstate = {...state,
                        isFetching: false,
                        statusError: action.error};
            break;
        case ctrlC.CONTROLLER_SET_USER_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        statusError: undefined,
                        currentUserId: action.userId};
            break;
        case ctrlC.CONTROLLER_CLEAR_USER_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        statusError: undefined};
            break;
        case ctrlC.CONTROLLER_CLEAR_USER_ERROR:
            newstate = {...state,
                        isFetching: false,
                        statusError: action.error};
            break;
        case ctrlC.CONTROLLER_CLEAR_USER_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        statusError: undefined,
                        currentUserId: undefined };
            break;
        case ctrlC.CONTROLLER_SET_PROJECT_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        statusError: undefined};
            break;
        case ctrlC.CONTROLLER_SET_PROJECT_ERROR:
            newstate = {...state,
                        isFetching: false,
                        statusError: action.error};
            break;
        case ctrlC.CONTROLLER_SET_PROJECT_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        statusError: undefined,
                        currentProjectId: action.projectId};
            break;
        case ctrlC.CONTROLLER_CLEAR_PROJECT_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        statusError: undefined};
            break;
        case ctrlC.CONTROLLER_CLEAR_PROJECT_ERROR:
            newstate = {...state,
                        isFetching: false,
                        statusError: action.error};
            break;
        case ctrlC.CONTROLLER_CLEAR_PROJECT_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        statusError: undefined,
                        currentProjectId: undefined};
            break;
        case ctrlC.CONTROLLER_START_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        statusError: undefined};
            break;
        case ctrlC.CONTROLLER_START_ERROR:
            newstate = {...state,
                        isFetching: false,
                        statusError: action.error};
            break;
        case ctrlC.CONTROLLER_START_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        statusError: undefined};
            break;
        case ctrlC.CONTROLLER_RESUME_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        statusError: undefined};
            break;
        case ctrlC.CONTROLLER_RESUME_ERROR:
            newstate = {...state,
                        isFetching: false,
                        statusError: action.error};
            break;
        case ctrlC.CONTROLLER_RESUME_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        statusError: undefined};
            break;
        case ctrlC.CONTROLLER_PAUSE_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        statusError: undefined};
            break;
        case ctrlC.CONTROLLER_PAUSE_ERROR:
            newstate = {...state,
                        isFetching: false,
                        statusError: action.error};
            break;
        case ctrlC.CONTROLLER_PAUSE_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        statusError: undefined};
            break;
        case ctrlC.CONTROLLER_STOP_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        statusError: undefined};
            break;
        case ctrlC.CONTROLLER_STOP_ERROR:
            newstate = {...state,
                        isFetching: false,
                        statusError: action.error};
            break;
        case ctrlC.CONTROLLER_STOP_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        statusError: undefined};
            break;
        case ctrlC.CONTROLLER_GET_CURRENT_STATUS_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        statusError: undefined};
            break;
        case ctrlC.CONTROLLER_GET_CURRENT_STATUS_ERROR:
            newstate = {...state,
                        isFetching: false,
                        statusError: action.error};
            break;
        case ctrlC.CONTROLLER_GET_CURRENT_STATUS_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        status: action.status,
                        location: action.location,
                        currentUserId: action.userId,
                        currentProjectId: action.projectId};
            break;
        default:
            break;
    }
    return(newstate);
}

export default controller;

export const getControllerStatus = state => (state.status);
export const getControllerLocation = state => (state.location);
