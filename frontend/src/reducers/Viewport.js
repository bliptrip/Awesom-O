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
import * as viewportC from '../actions';

const viewport = (state = {
                    src: undefined,
                    isFetching: false,
                    errorStatus: undefined,
                    previewEnabled: false,
                    thumbnails: {}
                  }, action) => {
    let newstate = state;
    switch( action.type ) {
        case viewportC.VIEWPORT_SET_CURRENT_PICTURE:
            newstate = {...state,
                        src: action.src};
            break;
        case viewportC.VIEWPORT_SET_THUMBNAIL:
            newstate = {...state};
            if (newstate.thumbnails)
                newstate.thumbnails = {...newstate.thumbnails};
            if (newstate.thumbnails[action.row])
                newstate.thumbnails[action.row] = {...newstate.thumbnails[action.row]};
            else
                newstate.thumbnails[action.row] = {}
            if (newstate.thumbnails[action.row][action.col])
                newstate.thumbnails[action.row][action.col] = {...newstate.thumbnails[action.row][action.col]};
            newstate.thumbnails[action.row][action.col] = action.src
            break;
        case viewportC.VIEWPORT_GET_CURRENT_PICTURE_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        errorStatus: undefined};
            break;
        case viewportC.VIEWPORT_GET_CURRENT_PICTURE_ERROR:
            newstate = {...state,
                        isFetching: false,
                        errorStatus: action.error};
            break;
        case viewportC.VIEWPORT_GET_CURRENT_PICTURE_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        errorStatus: undefined,
                        src: action.src};
            break;
        case viewportC.VIEWPORT_SET_PREVIEW_ENABLED:
            newstate = {...state,
                        previewEnabled: action.enabled};
            break;
        case viewportC.VIEWPORT_GET_PREVIEW_ENABLED_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        errorStatus: undefined};
            break;
        case viewportC.VIEWPORT_GET_PREVIEW_ENABLED_ERROR:
            newstate = {...state,
                        isFetching: false,
                        errorStatus: action.error};
            break;
        case viewportC.VIEWPORT_GET_PREVIEW_ENABLED_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        errorStatus: undefined,
                        previewEnabled: action.enabled};
            break;
        case viewportC.VIEWPORT_PREVIEW_START_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        errorStatus: undefined};
            break;
        case viewportC.VIEWPORT_PREVIEW_START_ERROR:
            newstate = {...state,
                        isFetching: false,
                        errorStatus: action.error};
            break;
        case viewportC.VIEWPORT_PREVIEW_START_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        errorStatus: undefined,
                        previewEnabled: true};
            break;
        case viewportC.VIEWPORT_PREVIEW_STOP_REQUEST:
            newstate = {...state,
                        isFetching: true,
                        errorStatus: undefined};
            break;
        case viewportC.VIEWPORT_PREVIEW_STOP_ERROR:
            newstate = {...state,
                        isFetching: false,
                        errorStatus: action.error};
            break;
        case viewportC.VIEWPORT_PREVIEW_STOP_SUCCESS:
            newstate = {...state,
                        isFetching: false,
                        errorStatus: undefined,
                        previewEnabled: false};
            break;
        default:
            break;
    }
    return(newstate);
}

export default viewport;
