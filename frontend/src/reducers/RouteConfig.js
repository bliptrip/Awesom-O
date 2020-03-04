/**************************************************************************************
This file is part of Awesom-O, an image acquisition and analysis web application,
consisting of a frontend web interface and a backend database, camera, and motor access
management framework.

Copyright (C)  2020  Andrew F. Maule

Awesom-O is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Awesom-O is distributed in thE hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this Awesom-O.  If not, see <https://www.gnu.org/licenses/>.
**************************************************************************************/
import * as routeC from '../actions';
export const route = (state = {
                                _id: undefined,
                                isFetching: false,
                                statusError: undefined,
                                areSaving: false,
                                isEditorOpen: false,
                                isLoadDialogOpen: false,
                                savedRouteConfigs:[],
                                route: [] }, action) => {
    let newstate = state;
    switch( action.type ) {
        case routeC.ROUTE_CONFIG_REMOVE_REQUEST:
            newstate = { ...state,
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
        case routeC.ROUTE_CONFIG_SET_SHORT:
            newstate = {...state,
                shortDescription: action.shortDescription
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
                shortDescription: action.routeConfig.shortDescription,
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
                interplateDelay: action.seconds
            };
            break;
        case routeC.ROUTE_CONFIG_SET_LOOP_DELAY:
            newstate = { ...state,
                loopDelay: action.seconds
            };
            break;
        case routeC.ROUTE_CONFIG_SET_STEPS_PER_CM_X:
            newstate = { ...state,
                stepsPerCmX: action.steps
            };
            break;
        case routeC.ROUTE_CONFIG_SET_STEPS_PER_CM_Y:
            newstate = { ...state,
                stepsPerCmY: action.steps
            };
            break;
        case routeC.ROUTE_CONFIG_SET_DISTANCE_X:
            newstate = { ...state,
                distanceX: action.plateDistanceX
            };
            break;
        case routeC.ROUTE_CONFIG_SET_DISTANCE_Y:
            newstate = { ...state,
                distanceY: action.plateDistanceY
            };
            break;
        case routeC.ROUTE_CONFIG_ADD_ROUTE:
            newstate = { ...state };
            newstate.route = [...newstate.route];
            newstate.route.push({row: action.row, col: action.col});
            break;
        case routeC.ROUTE_CONFIG_REMOVE_ROUTE:
            newstate = { ...state };
            newstate.route = newstate.route.filter( (r) => ((r.row !== action.row) && (r.col !== action.col)) );
            break;
        case routeC.ROUTE_CONFIG_CLEAR_ROUTE:
            newstate = { ...state,
                         route: [] };
            break;
        case routeC.ROUTE_CONFIG_SAVE_REQUEST:
            newstate = { ...state,
                areSaving: true, //TODO: Check that we aren't already processing a save or fetching request
                statusError: undefined
            };
            break;
        case routeC.ROUTE_CONFIG_SAVE_ERROR:
            newstate = { ...state,
                areSaving: false,
                statusError: action.error };
            break;
        case routeC.ROUTE_CONFIG_SAVE_SUCCESS:
            newstate = { ...state,
                areSaving: false}
            break;
        case routeC.ROUTE_CONFIG_RESET_STALE_FLAG:
            newstate = { ...state,
                stale: false };
            break;
        case routeC.ROUTE_CONFIG_LOAD_SAVED_REQUEST:
            newstate = { ...state,
                isFetching: true,
                statusError: undefined,
                savedRouteConfigs: []
            };
            break;
        case routeC.ROUTE_CONFIG_LOAD_SAVED_ERROR:
            newstate = { ...state,
                isFetching: false,
                statusError: action.error
            };
            break;
        case routeC.ROUTE_CONFIG_LOAD_SAVED_SUCCESS:
            newstate = { ...state,
                isFetching: false,
                statusError: undefined,
                savedRouteConfigs: action.routeConfigs
            };
            break;
        case routeC.ROUTE_CONFIG_SET_EDITOR_OPEN:
            newstate = { ...state,
                isEditorOpen: action.isEditorOpen };
            break;
        case routeC.ROUTE_CONFIG_SET_LOAD_DIALOG_OPEN:
            newstate    = {...state,
                isLoadDialogOpen: action.isLoadDialogOpen
            };
            break;
        default:
            break;
    }
    return(newstate);
}
