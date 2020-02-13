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

/* Define our action creators here */

export const USER_SET_USERNAME = 'USER_SET_USERNAME';
export const userSetUsername(username) => ({
    type: USER_SET_USERNAME,
    username
});

export const USER_SET_EMAIL = 'USER_SET_EMAIL';
export const userSetEmail(email) => ({
    type: USER_SET_EMAIL,
    email
});

export const USER_SET_PASSWORD = 'USER_SET_PASSWORD';
export const userSetPassword(password) => ({
    type: USER_SET_PASSWORD,
    password
});

export const USER_SET_TOKEN = 'USER_SET_TOKEN';
export const userSetToken(token) => ({
    type: USER_SET_TOKEN,
    token
});

export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const userLoginRequest = () => ({
    type: USER_LOGIN_REQUEST
});

export const USER_LOGIN_ERROR = 'USER_LOGIN_ERROR';
export const userLoginError = (error) => ({
    type: USER_LOGIN_ERROR,
    error
});

export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const userLoginSuccess = (token, user) => ({
    type: USER_LOGIN_SUCCESS,
    token,
    user
});

/* Create a New User */
export const USER_CREATE_REQUEST = 'USER_CREATE_REQUEST';
export const userCreateRequest = () => ({
    type: USER_CREATE_REQUEST
});

export const USER_CREATE_ERROR = 'USER_CREATE_ERROR';
export const userCreateError = (error) => ({
    type: USER_CREATE_ERROR,
    error,
});

export const USER_CREATE_SUCCESS = 'USER_CREATE_SUCCESS';
export const userCreateSuccess = () => ({
    type: USER_CREATE_SUCCESS,
});

/*
 * Fetch User Schema Data from DB
 */
export const USER_FETCH_REQUEST = 'USER_FETCH_REQUEST';
export const userFetchRequest = () => ({
    type: USER_FETCH_REQUEST
});

export const USER_FETCH_ERROR = 'USER_FETCH_ERROR';
export const userFetchError = (error) => ({
    type: USER_FETCH_ERROR,
    error
});

export const USER_FETCH_SUCCESS = 'USER_FETCH_SUCCESS';
export const userFetchSuccess = (user) => ({
    type: USER_FETCH_SUCCESS,
    user
});

//Project-level action creators
export const PROJECT_FETCH_REQUEST = 'PROJECT_FETCH_REQUEST';
export const projectFetchRequest = (id) => ({
    type: PROJECT_FETCH_REQUEST,
    id,
});

export const PROJECT_FETCH_ERROR = 'PROJECT_FETCH_ERROR';
export const projectFetchError = (error) => ({
    type: PROJECT_FETCH_ERROR,
    error,
});

export const PROJECT_FETCH_SUCCESS = 'PROJECT_FETCH_SUCCESS';
export const projectFetchSuccess = (project) => ({
    type: PROJECT_FETCH_SUCCESS,
    project,
});

export const PROJECT_SAVE_REQUEST = 'PROJECT_SAVE_REQUEST';
export const projectSaveRequest = (project) => ({
    type: PROJECT_SAVE_REQUEST,
    project,
});

export const PROJECT_SAVE_ERROR = 'PROJECT_SAVE_ERROR';
export const projectSaveError = (error) => ({
    type: PROJECT_SAVE_ERROR,
    error,
});

export const PROJECT_SAVE_SUCESS = 'PROJECT_SAVE_SUCCESS';
export const projectSaveSuccess= (id) => ({
    type: PROJECT_SAVE_SUCCESS,
    id
});

export const PROJECT_SET_DESCRIPTION = "PROJECT_SET_DESCRIPTION";
export const projectSetDescription = (id, description) => ({
    type: PROJECT_SET_DESCRIPTION,
    id, //Project ID
    description,
});

export const PROJECT_SET_CAMERA_CONFIG = "PROJECT_SET_CAMERA_CONFIG";
export const projectSetCameraConfig= (id, cameraId) => ({
    type: PROJECT_SET_CAMERA_CONFIG,
    id, //Project ID
    cameraId,
});

export const PROJECT_SET_EXPERIMENT_CONFIG = "PROJECT_SET_EXPERIMENT_CONFIG";
export const projectSetExperimentConfig = (id, experimentId) => ({
    type: PROJECT_SET_EXPERIMENT_CONFIG,
    id, //Project ID
    experimentId,
});

export const PROJECT_ADD_STORAGE_CONFIG = "PROJECT_ADD_STORAGE_CONFIG";
export const projectAddStorageConfig = (id, storageId) => ({
    type: PROJECT_ADD_STORAGE_CONFIG,
    id, //Project ID
    storageId,
});

export const PROJECT_REMOVE_STORAGE_CONFIG = "PROJECT_REMOVE_STORAGE_CONFIG";
export const projectRemoveStorageConfig = (id, storageId) => ({
    type: PROJECT_REMOVE_STORAGE_CONFIG,
    id, //Project ID
    storageId,
});

export const PROJECT_CLEAR_STORAGE_CONFIG = "PROJECT_CLEAR_STORAGE_CONFIG";
export const projectClearStorageConfig = (id) => ({
    type: PROJECT_CLEAR_STORAGE_CONFIG,
    id //Project ID
});

export const PROJECT_SET_ROUTE_CONFIG = "PROJECT_SET_ROUTE_CONFIG";
export const projectSetRouteConfig = (id, routeId) => ({
    type: PROJECT_SET_ROUTE_CONFIG,
    id, //Project ID
    routeId,
});

//Camera-configuration action-creators
export const CAMERA_CONFIG_REQUEST = 'CAMERA_CONFIG_REQUEST';
export const cameraConfigFetchRequest = (id) => ({
    type: CAMERA_CONFIG_REQUEST,
    id,
});

export const CAMERA_CONFIG_ERROR = 'CAMERA_CONFIG_ERROR';
export const cameraConfigFetchError = (error) => ({
    type: CAMERA_CONFIG_ERROR,
    error,
});

export const CAMERA_CONFIG_SUCCESS = 'CAMERA_CONFIG_SUCCESS';
export const cameraConfigFetchSuccess = (cameraConfig) => ({
    type: CAMERA_CONFIG_SUCCESS,
    cameraConfig,
});

export const CAMERA_CONFIG_SET_DESCRIPTION = 'CAMERA_CONFIG_SET_DESCRIPTION';
export const cameraConfigSetDescription = (id, description) => ({
    type: CAMERA_CONFIG_SET_DESCRIPTION,
    id,
    description,
});

export const CAMERA_CONFIG_SET_MANUFACTURER = 'CAMERA_CONFIG_SET_MANUFACTURER';
export const cameraConfigSetManufacturer = (id, manufacturer) => ({
    type: CAMERA_CONFIG_SET_MANUFACTURER,
    id,
    manufacturer,
});

export const CAMERA_CONFIG_SET_MODEL = 'CAMERA_CONFIG_SET_MODEL';
export const cameraConfigSetModel = (id,model) => ({
    type: CAMERA_CONFIG_SET_MODEL,
    id,
    model,
});

export const CAMERA_CONFIG_SET_DEVICE_VERSION = 'CAMERA_CONFIG_SET_DEVICE_VERSION';
export const cameraConfigSetDeviceVersion = (id,deviceVersion) => ({
    type: CAMERA_CONFIG_SET_DEVICE_VERSION,
    id,
    deviceVersion,
});

export const CAMERA_CONFIG_SET_SN = 'CAMERA_CONFIG_SET_SN';
export const cameraConfigSetSN = (id,sn) => ({
    type: CAMERA_CONFIG_SET_SN,
    id,
    sn,
});

export const CAMERA_CONFIG_SET_GPHOTO2_CONFIG = 'CAMERA_CONFIG_SET_GPHOTO2_CONFIG';
export const cameraConfigSetGphoto2Config = (id,gphoto2Config) => ({
    type: CAMERA_CONFIG_SET_GPHOTO2_CONFIG,
    id,
    gphoto2Config,
});

export const CAMERA_CONFIG_SAVE_REQUEST = 'CAMERA_CONFIG_SAVE_REQUEST';
export const cameraConfigSaveRequest = (cameraConfig) => ({
    type: CAMERA_CONFIG_SAVE_REQUEST,
    cameraConfig,
});

export const CAMERA_CONFIG_SAVE_ERROR = 'CAMERA_CONFIG_SAVE_ERROR';
export const cameraConfigSaveError = (error) => ({
    type: CAMERA_CONFIG_SAVE_ERROR,
    error,
});

export const CAMERA_CONFIG_SAVE_SUCCESS = 'CAMERA_CONFIG_SAVE_SUCCESS';
export const cameraConfigSaveSuccess = (id) => ({
    type: CAMERA_CONFIG_SAVE_SUCESS,
    id,
});

//Experimental Config
export const EXPERIMENT_CONFIG_REQUEST = 'EXPERIMENT_CONFIG_REQUEST';
export const experimentConfigFetchRequest = (id) => ({
    type: EXPERIMENT_CONFIG_REQUEST,
    id,
});

export const EXPERIMENT_CONFIG_ERROR = 'EXPERIMENT_CONFIG_ERROR';
export const experimentConfigFetchError = (error) => ({
    type: EXPERIMENT_CONFIG_ERROR,
    error,
});

export const EXPERIMENT_CONFIG_SUCCESS = 'EXPERIMENT_CONFIG_SUCCESS';
export const experimentConfigFetchSuccess = (experimentConfig) => ({
    type: EXPERIMENT_CONFIG_SUCCESS,
    project,
});

export const EXPERIMENT_CONFIG_SET_DATETIME = 'EXPERIMENT_CONFIG_SET_DATETIME';
export const experimentConfigSetDatetime = (id, appendDT) => ({
    type: EXPERIMENT_CONFIG_SET_DATETIME,
    id,
    datetime: appendDT,
});

export const EXPERIMENT_CONFIG_SET_RENAME = 'EXPERIMENT_CONFIG_SET_RENAME';
export const experimentConfigSetRename = (id, renameFile) => ({
    type: EXPERIMENT_CONFIG_SET_RENAME,
    id,
    rename: renameFile,
});

export const EXPERIMENT_CONFIG_SET_IMAGE_META = 'EXPERIMENT_CONFIG_SET_IMAGE_META';
export const experimentConfigSetImageMeta = (id, embedImageMeta) => ({
    type: EXPERIMENT_CONFIG_SET_IMAGE_META,
    id,
    imageMeta: embedImageMeta,
});

export const EXPERIMENT_CONFIG_SET_FILENAME_FIELDS = 'EXPERIMENT_CONFIG_SET_FILENAME_FIELDS';
export const experimentConfigSetFilenameFields = (id, filenameFields) => ({
    type: EXPERIMENT_CONFIG_SET_FILENAME_FIELDS,
    id,
    filenameFields,
});

//Add plate
export const EXPERIMENT_CONFIG_ADD_PLATE = 'EXPERIMENT_CONFIG_ADD_PLATE';
export const experimentConfigAddPlate = (id,row,col,meta) => ({
    type: EXPERIMENT_CONFIG_ADD_PLATE,
    row,
    col,
    meta,
});

export const EXPERIMENT_CONFIG_REMOVE_PLATE = 'EXPERIMENT_CONFIG_REMOVE_PLATE';
export const experimentConfigRemovePlate = (id, row,col) => ({
    type: EXPERIMENT_CONFIG_REMOVE_PLATE,
    row,
    col
});

export const EXPERIMENT_CONFIG_SAVE_REQUEST = 'EXPERIMENT_CONFIG_SAVE_REQUEST';
export const experimentConfigSaveRequest = (experimentConfig) => ({
    type: EXPERIMENT_CONFIG_SAVE_REQUEST,
    experimentConfig,
});

export const EXPERIMENT_CONFIG_SAVE_ERROR = 'EXPERIMENT_CONFIG_SAVE_ERROR';
export const experimentConfigSaveError = (error) => ({
    type: EXPERIMENT_CONFIG_SAVE_ERROR,
    error,
});

export const EXPERIMENT_CONFIG_SAVE_SUCCESS = 'EXPERIMENT_CONFIG_SAVE_SUCCESS';
export const experimentConfigSaveSuccess = (id) => ({
    type: EXPERIMENT_CONFIG_SAVE_SUCESS,
    id,
});

/*
 * Storage configuration
 */
export const STORAGE_CONFIG_REQUEST = 'STORAGE_CONFIG_REQUEST';
export const storageConfigFetchRequest = (id) => ({
    type: STORAGE_CONFIG_REQUEST,
    id,
});

export const STORAGE_CONFIG_ERROR = 'STORAGE_CONFIG_ERROR';
export const storageConfigFetchError = (error) => ({
    type: STORAGE_CONFIG_ERROR,
    error,
});

export const STORAGE_CONFIG_SUCCESS = 'STORAGE_CONFIG_SUCCESS';
export const storageConfigFetchSuccess = (storageConfig) => ({
    type: STORAGE_CONFIG_SUCCESS,
    storageConfig,
});

export const STORAGE_CONFIG_SET_TYPE = 'STORAGE_CONFIG_SET_TYPE';
export const storageConfigSetType = (id, type) => ({
    type: STORAGE_CONFIG_SET_TYPE,
    id,
    type
});

export const STORAGE_CONFIG_SET_PARAMS = 'STORAGE_CONFIG_SET_PARAMS';
export const storageConfigSetParams = (id, params) => ({
    type: STORAGE_CONFIG_SET_PARAMS,
    id,
    params
});

export const STORAGE_CONFIG_SAVE_REQUEST = 'STORAGE_CONFIG_SAVE_REQUEST';
export const storageConfigSaveRequest = (storageConfig) => ({
    type: STORAGE_CONFIG_SAVE_REQUEST,
    storageConfig,
});

export const STORAGE_CONFIG_SAVE_ERROR = 'STORAGE_CONFIG_SAVE_ERROR';
export const storageConfigSaveError = (error) => ({
    type: STORAGE_CONFIG_SAVE_ERROR,
    error,
});

export const STORAGE_CONFIG_SAVE_SUCCESS = 'STORAGE_CONFIG_SAVE_SUCCESS';
export const storageConfigSaveSuccess = (id) => ({
    type: STORAGE_CONFIG_SAVE_SUCESS,
    id,
});

export const STORAGE_TYPE_REQUEST = 'STORAGE_TYPE_REQUEST';
export const storageTypeFetchRequest = (id) => ({
    type: STORAGE_TYPE_REQUEST,
    id,
});

export const STORAGE_TYPE_ERROR = 'STORAGE_TYPE_ERROR';
export const storageTypeFetchError = (error) => ({
    type: STORAGE_TYPE_ERROR,
    error,
});

export const STORAGE_TYPE_SUCCESS = 'STORAGE_TYPE_SUCCESS';
export const storageTypeFetchSuccess = (storageType) => ({
    type: STORAGE_TYPE_SUCCESS,
    storageType,
});

/*
 * Route configuration
 */
export const ROUTE_CONFIG_FETCH_REQUEST = 'ROUTE_CONFIG_FETCH_REQUEST';
export const routeConfigFetchRequest = (id) => ({
    type: ROUTE_CONFIG_FETCH_REQUEST,
    id,
});

export const ROUTE_CONFIG_FETCH_ERROR = 'ROUTE_CONFIG_FETCH_ERROR';
export const routeConfigFetchError = (error) => ({
    type: ROUTE_CONFIG_FETCH_ERROR,
    error,
});

export const ROUTE_CONFIG_REQUEST_SUCCESS = 'ROUTE_CONFIG_REQUEST_SUCCESS';
export const routeConfigFetchSuccess = (routeConfig) => ({
    type: ROUTE_CONFIG_REQUEST_SUCCESS,
    routeConfig,
});

export const ROUTE_CONFIG_SET_INTERPLATE_DELAY = 'ROUTE_CONFIG_SET_INTERPLATE_DELAY';
export const routeConfigSetLoopDelay = (id, seconds) => ({
    type: ROUTE_CONFIG_SET_INTERPLATE_DELAY,
    id,
    seconds,
});

export const ROUTE_CONFIG_SET_LOOP_DELAY = 'ROUTE_CONFIG_SET_LOOP_DELAY';
export const routeConfigSetLoopDelay = (id, seconds) => ({
    type: ROUTE_CONFIG_SET_LOOP_DELAY,
    id,
    seconds,
});

export const ROUTE_CONFIG_SET_STEPS_PER_CM_X = 'ROUTE_CONFIG_SET_STEPS_PER_CM_X';
export const routeConfigSetStepsPerCmX = (id, steps) => ({
    type: ROUTE_CONFIG_SET_STEPS_PER_CM_X,
    id,
    steps,
});

export const ROUTE_CONFIG_SET_STEPS_PER_CM_Y = 'ROUTE_CONFIG_SET_STEPS_PER_CM_Y';
export const routeConfigSetStepsPerCmX = (id, steps) => ({
    type: ROUTE_CONFIG_SET_STEPS_PER_CM_Y,
    id,
    steps,
});

export const ROUTE_CONFIG_SET_DISTANCE_X = 'ROUTE_CONFIG_SET_DISTANCE_X';
export const routeConfigSetDistanceX = (id, plateDistanceX) => ({
    type: ROUTE_CONFIG_SET_DISTANCE_X,
    id,
    plateDistanceX,
});

export const ROUTE_CONFIG_SET_DISTANCE_Y = 'ROUTE_CONFIG_SET_DISTANCE_Y';
export const routeConfigSetDistanceX = (id, plateDistanceY) => ({
    type: ROUTE_CONFIG_SET_DISTANCE_Y,
    id,
    plateDistanceY,
});

export const ROUTE_CONFIG_ADD_ROUTE = 'ROUTE_CONFIG_ADD_ROUTE';
export const routeConfigAddRoute = (id, row, col) => ({
    type: ROUTE_CONFIG_ADD_ROUTE,
    id,
    row,
    col,
});

export const ROUTE_CONFIG_REMOVE_ROUTE = 'ROUTE_CONFIG_REMOVE_ROUTE';
export const routeConfigRemoveRoute = (id, row, col) => ({
    type: ROUTE_CONFIG_REMOVE_ROUTE,
    id,
    row,
    col,
});

export const ROUTE_CONFIG_SAVE_REQUEST = 'ROUTE_CONFIG_SAVE_REQUEST';
export const routeConfigSaveRequest = (routeConfig) => ({
    type: ROUTE_CONFIG_SAVE_REQUEST,
    routeConfig,
});

export const ROUTE_CONFIG_SAVE_ERROR = 'ROUTE_CONFIG_SAVE_ERROR';
export const routeConfigSaveError = (error) => ({
    type: ROUTE_CONFIG_SAVE_ERROR,
    error,
});

export const ROUTE_CONFIG_SAVE_SUCCESS = 'ROUTE_CONFIG_SAVE_SUCCESS';
export const routeConfigSaveSuccess = (id) => ({
    type: ROUTE_CONFIG_SAVE_SUCESS,
    id,
});

//Viewport receive current picture
export const receiveCurrentPicture = (src) => ({
    type: "RECEIVE_CURRENT_PICTURE",
    src,
});

//Controller state: Things like running, paused, stopped, and current location of camera arm (row, col)
export const receiveControllerStateStatus = (status) => ({
    type: "RECEIVE_CONTROLLER_STATE_STATUS",
    status: status,
});

export const receiveControllerStateLocation = (location) => ({
    type: "RECEIVE_CONTROLLER_STATE_LOCATION",
    location: location,
});
