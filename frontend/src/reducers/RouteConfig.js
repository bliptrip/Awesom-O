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
import * as routeC from '../actions';

export const route = (state = {}, action) => {
    let newstate = state;
    switch( action.type ) {
        case routeC.ROUTE_CONFIG_REMOVE_REQUEST:
            newstate = { ...state,
                _id: action._id,
                isFetching: true,
                statusError: undefined,
            };
            break;
        case routeC.ROUTE_CONFIG_REMOVE_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case routeC.ROUTE_CONFIG_REMOVE_SUCCESS:
            newstate = { ...state,
                _id: undefined,
                isFetching: false,
                statusError: undefined
            };
            break;
        case routeC.ROUTE_CONFIG_CREATE_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined,
            };
            break;
        case routeC.ROUTE_CONFIG_CREATE_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case routeC.ROUTE_CONFIG_FETCH_REQUEST:
            newstate = { ...state,
                _id: action.id,
                isFetching: true,
                statusError: undefined
            };
            break;
        case routeC.ROUTE_CONFIG_FETCH_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case routeC.ROUTE_CONFIG_CREATE_SUCCESS:
        case routeC.ROUTE_CONFIG_FETCH_SUCCESS:
            newstate = { ...state,
                _id: action.routeConfig._id, //TODO: Validate that ID returned is same as that requested
                isFetching: false,
                interplateDelay: action.routeConfig.interplateDelay,
                loopDelay: action.routeConfig.loopDelay,
                previewHooks: action.routeConfig.previewHooks,
                captureHooks: action.routeConfig.captureHooks,
                stepsPerCmX: action.routeConfig.stepsPerCmX,
                stepsPerCmY: action.routeConfig.stepsPerCmY,
                distanceX: action.routeConfig.distanceX,
                distanceY: action.routeConfig.distanceY,
                route: action.routeConfig.route,
                users: action.routeConfig.users,
                projects: action.routeConfig.projects
            };
            break;
        case routeC.ROUTE_CONFIG_SET_INTERPLATE_DELAY:
            newstate = { ...state,
                _id: action.id,
                interplateDelay: action.seconds
            };
            break;
        case routeC.ROUTE_CONFIG_SET_LOOP_DELAY:
            newstate = { ...state,
                _id: action.id,
                loopDelay: action.seconds
            };
            break;
        case routeC.ROUTE_CONFIG_SET_STEPS_PER_CM_X:
            newstate = { ...state,
                _id: action.id,
                stepsPerCmX: action.steps
            };
            break;
        case routeC.ROUTE_CONFIG_SET_STEPS_PER_CM_Y:
            newstate = { ...state,
                _id: action.id,
                stepsPerCmY: action.steps
            };
            break;
        case routeC.ROUTE_CONFIG_SET_DISTANCE_X:
            newstate = { ...state,
                _id: action.id,
                distanceX: action.plateDistanceX
            };
            break;
        case routeC.ROUTE_CONFIG_SET_DISTANCE_Y:
            newstate = { ...state,
                _id: action.id,
                distanceY: action.plateDistanceY
            };
            break;
        case routeC.ROUTE_CONFIG_ADD_ROUTE:
            newstate = { ...state,
                _id: action.routeConfig._id }; //TODO: validate id
            newstate.route.push({row: action.routeConfig.row, col: action.routeConfig.col});
            break;
        case routeC.ROUTE_CONFIG_REMOVE_ROUTE:
            newstate = { ...state,
                _id: action.routeConfig._id }; //TODO: validate id
            newstate.route = newstate.route.filter( (e) => ((e.row !== action.row) && (e.col !== action.col)) );
            break;
        case routeC.ROUTE_CONFIG_SAVE_REQUEST:
            newstate = { ...state,
                areSaving: true, //TODO: Check that we aren't already processing a save or fetching request
                statusError: undefined,
                _id: action.routeConfig._id
            };
            break;
        case routeC.ROUTE_CONFIG_SAVE_ERROR:
            newstate = { ...state,
                areSaving: false,
                statusError: action.error };
            break;
        case routeC.ROUTE_CONFIG_SAVE_SUCCESS:
            newstate = { ...state,
                areSaving: false,
                _id: action.id };
            break;
        default:
            break;
    }
    return(newstate);
}
