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
import {fetchAwesomO} from '../lib/fetch'; //Backwards-compatibility if fetch not supported by browser
import {cameraSettings2Gphoto2Config} from '../lib/camera';

/* Define our action creators here */
export const USER_SET_LOGSTATE = 'USER_SET_LOGSTATE';
export const userSetLogState = (loggedin)  => ({
    type: USER_SET_LOGSTATE,
    loggedin
});

export const USER_SET_USERNAME = 'USER_SET_USERNAME';
export const userSetUsername = (username) => ({
    type: USER_SET_USERNAME,
    username
});

export const USER_SET_EMAIL = 'USER_SET_EMAIL';
export const userSetEmail = (email) => ({
    type: USER_SET_EMAIL,
    email
});

export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const userLoginRequest = (username) => ({
    type: USER_LOGIN_REQUEST,
    username: username
});

export const USER_LOGIN_ERROR = 'USER_LOGIN_ERROR';
export const userLoginError = (error) => ({
    type: USER_LOGIN_ERROR,
    error
});

export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const userLoginSuccess = (user) => ({
    type: USER_LOGIN_SUCCESS,
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
    type: USER_CREATE_SUCCESS
});

/* Remove current user */
export const USER_REMOVE_REQUEST = 'USER_REMOVE_REQUEST';
export const userRemoveRequest = (_id) => ({
    type: USER_REMOVE_REQUEST,
    _id: _id
});

export const USER_REMOVE_ERROR = 'USER_REMOVE_ERROR';
export const userRemoveError = (error) => ({
    type: USER_REMOVE_ERROR,
    error,
});

export const USER_REMOVE_SUCCESS = 'USER_REMOVE_SUCCESS';
export const userRemoveSuccess = (_id) => ({
    type: USER_REMOVE_SUCCESS,
    _id: _id
});

/* Remove current user */
export const USER_SAVE_REQUEST = 'USER_SAVE_REQUEST';
export const userSaveRequest = (user) => ({
    type: USER_SAVE_REQUEST,
    user
});

export const USER_SAVE_ERROR = 'USER_SAVE_ERROR';
export const userSaveError = (error) => ({
    type: USER_SAVE_ERROR,
    error,
});

export const USER_SAVE_SUCCESS = 'USER_SAVE_SUCCESS';
export const userSaveSuccess = (_id) => ({
    type: USER_SAVE_SUCCESS,
    _id
});

export const USER_CHANGEPASSWORD_REQUEST = 'USER_CHANGEPASSWORD_REQUEST';
export const userChangePasswordRequest = (_id) => ({
    type: USER_CHANGEPASSWORD_REQUEST,
    _id: _id
});

export const USER_CHANGEPASSWORD_ERROR = 'USER_CHANGEPASSWORD_ERROR';
export const userChangePasswordError = (error) => ({
    type: USER_CHANGEPASSWORD_ERROR,
    error,
});

export const USER_CHANGEPASSWORD_SUCCESS = 'USER_CHANGEPASSWORD_SUCCESS';
export const userChangePasswordSuccess = (_id) => ({
    type: USER_CHANGEPASSWORD_SUCCESS,
    _id: _id
});

export const USER_SET_EDITOR_OPEN = 'USER_SET_EDITOR_OPEN';
export const userSetEditorOpen = (open) => ({
    type: USER_SET_EDITOR_OPEN,
    isEditorOpen: open
});

/*
 * Fetch User Schema Data from DB
 */
export const USER_FETCH_REQUEST = 'USER_FETCH_REQUEST';
export const userFetchRequest = (username) => ({
    type: USER_FETCH_REQUEST,
    username: username
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

/* User-action thunks */
export const userCheckCurrent = () => dispatch => {
    return(fetchAwesomO({url: '/api/users/current'})
    .then( response => response.json(),
        error => dispatch(userSetLogState(false))
    )
    .then( (user) => {
        dispatch(userSetLogState(true));
        dispatch(userFetchSuccess(user)); }
    ));
}

export const userLogin = (username,password) => dispatch =>  {
    dispatch(userLoginRequest(username))
    return(fetchAwesomO({
                url: '/api/users/login',
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body: {username: username,
                      password: password}})
    .then( response => response.json(),
        error => dispatch(userLoginError(error))
    )
    .then( (data) => 
        dispatch(userLoginSuccess(data))
    ));
};

export const userCreate = (username,email,password) => dispatch =>  {
    dispatch(userCreateRequest())
    return(fetchAwesomO({
                url: '/api/users/create',
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body: {username: username,
                      email: email,
                      password: password}})
    .then( response => response.json(),
        error => dispatch(userCreateError(error))
    )
    .then( (data) => {
        dispatch(userCreateSuccess(data))
    }));
};

export const userRemove = (_id) => dispatch =>  {
    let fetchURL;
    //TODO - Recursively remove all projects associated with this user?
    dispatch(userRemoveRequest(_id))
    fetchURL = '/api/users/remove/' + _id;
    return(fetchAwesomO({url: fetchURL})
    .then( response => response.json(),
        error => dispatch(userRemoveError(error))
    )
    .then( (data) => 
        dispatch(userRemoveSuccess(data))
    ));
};

/* Not sure if userFetch logic is necessary, but it's implemented just in case */
export const userFetch = username => dispatch =>  {
    dispatch(userFetchRequest(username))
    return(fetchAwesomO({url: '/api/users/get/'+username})
    .then( response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => dispatch(userFetchError(error))
    )
    .then(user =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(userFetchSuccess(user))
    ));
};

export const userSave = user => dispatch =>  {
    dispatch(userSaveRequest(user))
    return(fetchAwesomO({
        url: '/api/users/save',
        method: 'POST',
        body: user})
    .then( response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => dispatch(userSaveError(error))
    )
    .then(user =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(userSaveSuccess(user))
    ));
};

export const userChangePassword = (_id, oldpassword, password) => dispatch =>  {
    dispatch(userChangePasswordRequest(_id));
    return(fetchAwesomO({
        url: '/api/users/changepassword',
        method: 'POST',
        body: {_id: _id,
              oldpassword: oldpassword,
              password: password}})
    .then( response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => dispatch(userChangePasswordError(error))
    )
    .then(_id =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(userChangePasswordSuccess(_id))
    ));
};

export const userLogout = () => dispatch =>  {
    return(fetchAwesomO({url: '/api/users/logout'})
    .then(response => response.json())
    .then(_id =>
        dispatch(userSetLogState(false))
    ));
};


//Project-level action creators
export const PROJECT_CREATE_REQUEST = 'PROJECT_CREATE_REQUEST';
export const projectCreateRequest = () => ({
    type: PROJECT_CREATE_REQUEST
});

export const PROJECT_CREATE_ERROR= 'PROJECT_CREATE_ERROR';
export const projectCreateError = (error) => ({
    type: PROJECT_CREATE_ERROR,
    error
});

export const PROJECT_CREATE_SUCCESS= 'PROJECT_CREATE_SUCCESS';
export const projectCreateSuccess = (project) => ({
    type: PROJECT_CREATE_SUCCESS,
    project
});

export const PROJECT_REMOVE_REQUEST = 'PROJECT_REMOVE_REQUEST';
export const projectRemoveRequest = (_id) => ({
    type: PROJECT_REMOVE_REQUEST,
    _id
});

export const PROJECT_REMOVE_ERROR= 'PROJECT_REMOVE_ERROR';
export const projectRemoveError = (error) => ({
    type: PROJECT_REMOVE_ERROR,
    error
});

export const PROJECT_REMOVE_SUCCESS= 'PROJECT_REMOVE_SUCCESS';
export const projectRemoveSuccess= (_id) => ({
    type: PROJECT_REMOVE_SUCCESS,
    _id
});

export const PROJECT_FETCH_REQUEST = 'PROJECT_FETCH_REQUEST';
export const projectFetchRequest = (_id) => ({
    type: PROJECT_FETCH_REQUEST,
    _id,
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
export const projectSaveRequest = () => ({
    type: PROJECT_SAVE_REQUEST,
});

export const PROJECT_SAVE_ERROR = 'PROJECT_SAVE_ERROR';
export const projectSaveError = (error) => ({
    type: PROJECT_SAVE_ERROR,
    error
});

export const PROJECT_SAVE_SUCCESS = 'PROJECT_SAVE_SUCCESS';
export const projectSaveSuccess= (_id) => ({
    type: PROJECT_SAVE_SUCCESS,
    _id
});

export const PROJECT_SET_SHORT = "PROJECT_SET_SHORT";
export const projectSetShort = (shortDescription) => ({
    type: PROJECT_SET_SHORT,
    shortDescription: shortDescription 
});

export const PROJECT_SET_DESCRIPTION = "PROJECT_SET_DESCRIPTION";
export const projectSetDescription = (description) => ({
    type: PROJECT_SET_DESCRIPTION,
    description
});

export const PROJECT_SET_CAMERA_CONFIG = "PROJECT_SET_CAMERA_CONFIG";
export const projectSetCameraConfig= (cameraId) => ({
    type: PROJECT_SET_CAMERA_CONFIG,
    cameraId
});

export const PROJECT_SET_EXPERIMENT_CONFIG = "PROJECT_SET_EXPERIMENT_CONFIG";
export const projectSetExperimentConfig = (experimentId) => ({
    type: PROJECT_SET_EXPERIMENT_CONFIG,
    experimentId
});

export const PROJECT_SET_ROUTE_CONFIG = "PROJECT_SET_ROUTE_CONFIG";
export const projectSetRouteConfig = (routeId) => ({
    type: PROJECT_SET_ROUTE_CONFIG,
    routeId
});

export const PROJECT_ADD_STORAGE_CONFIG = "PROJECT_ADD_STORAGE_CONFIG";
export const projectAddStorageConfig = (storageId) => ({
    type: PROJECT_ADD_STORAGE_CONFIG,
    storageId
});

export const PROJECT_REMOVE_STORAGE_CONFIG = "PROJECT_REMOVE_STORAGE_CONFIG";
export const projectRemoveStorageConfig = (storageId) => ({
    type: PROJECT_REMOVE_STORAGE_CONFIG,
    storageId
});

export const PROJECT_CLEAR_STORAGE_CONFIGS = "PROJECT_CLEAR_STORAGE_CONFIGS";
export const projectClearStorageConfigs = () => ({
    type: PROJECT_CLEAR_STORAGE_CONFIGS,
});

export const PROJECT_SET_EDITOR_OPEN = "PROJECT_SET_EDITOR_OPEN";
export const projectSetEditorOpen = (open) => ({
    type: PROJECT_SET_EDITOR_OPEN,
    isEditorOpen: open
});

export const PROJECT_SET_LOAD_DIALOG_OPEN = "PROJECT_SET_LOAD_DIALOG_OPEN";
export const projectSetLoadDialogOpen = (open) => ({
    type: PROJECT_SET_LOAD_DIALOG_OPEN,
    isLoadDialogOpen: open
});

export const PROJECT_LOAD_SAVED_REQUEST = 'PROJECT_LOAD_SAVED_REQUEST';
export const projectLoadSavedRequest = () => ({
    type: PROJECT_LOAD_SAVED_REQUEST,
});

export const PROJECT_LOAD_SAVED_ERROR = 'PROJECT_LOAD_SAVED_ERROR';
export const projectLoadSavedError = (error) => ({
    type: PROJECT_LOAD_SAVED_ERROR,
    error
});

export const PROJECT_LOAD_SAVED_SUCCESS = 'PROJECT_LOAD_SAVED_SUCCESS';
export const projectLoadSavedSuccess= (savedProjects) => ({
    type: PROJECT_LOAD_SAVED_SUCCESS,
    savedProjects
});

/* Project thunks */
export const projectCreate = (userId,templateId=undefined) => dispatch => {
    let fetchURL;
    dispatch(projectCreateRequest(userId,templateId));
    fetchURL = '/api/project/create/';
    return(fetchAwesomO({
            url: fetchURL,
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body: {userId: userId,
                  templateId: templateId}})
    .then( response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => dispatch(projectCreateError(error))
    )
    .then(project => {
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(projectCreateSuccess(project))
        dispatch(cameraConfigInit());
        dispatch(experimentConfigInit());
        dispatch(routeConfigInit());
        dispatch(storageConfigInit());
    }));
};

export const projectRemove = (_id, userId) => dispatch => {
    dispatch(projectRemoveRequest(_id));
    return(fetchAwesomO({
        url: '/api/project/remove/',
        method: 'POST',
        headers:{'Content-type': 'application/json'},
        body: {
            _id,
            userId}})
    .then( response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => dispatch(projectRemoveError(error))
    )
    .then(_id =>
        dispatch(projectRemoveSuccess(_id))
    ));
};

export const projectFetch = _id => dispatch => {
    dispatch(projectFetchRequest(_id));
    return(fetchAwesomO({url: '/api/project/get/'+_id})
    .then( response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => dispatch(projectFetchError(error))
    )
    .then(project => {
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(projectFetchSuccess(project));
        if( project.cameraConfig ) {
            dispatch(cameraConfigFetchSuccess(project.cameraConfig));
        }
        if( project.experimentConfig ) {
            dispatch(experimentConfigFetchSuccess(project.experimentConfig));
        }
        if( project.routeConfig ) {
            dispatch(routeConfigFetchSuccess(project.routeConfig));
        }
        if( project.storageConfigs && (project.storageConfigs.length > 0) ) {
            dispatch(storageConfigFetchSuccess(project.storageConfigs[0]));
        }
    }));
};

const projectSaveHelper = (saveType,project,dispatch) => {
    dispatch(projectSaveRequest());
    return(fetchAwesomO({
        url: '/api/project/'+saveType, 
        method: 'POST', 
        body: project})
        .then(  response => response.json(),
                error => dispatch(projectSaveError(error)) )
        .then( project => dispatch(projectSaveSuccess(project._id))));
};

export const projectSave = (project) => dispatch => {
    return(projectSaveHelper('save',project,dispatch));
};

export const projectSaveAs = (project) => dispatch => {
    return(projectSaveHelper('saveas',project,dispatch));
};

export const projectLoadSaved = userId => dispatch => {
    dispatch(projectLoadSavedRequest());
    return(fetchAwesomO({url: '/api/project/load/'+userId})
    .then( response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => dispatch(projectLoadSavedError(error))
    )
    .then(projects =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(projectLoadSavedSuccess(projects))
    ));
};

//Camera-configuration action-creators
export const CAMERA_CONFIG_INIT = 'CAMERA_CONFIG_INIT';
export const cameraConfigInit = () => ({
    type: CAMERA_CONFIG_INIT,
});

export const CAMERA_CONFIG_CREATE_REQUEST = 'CAMERA_CONFIG_CREATE_REQUEST';
export const cameraConfigCreateRequest = () => ({
    type: CAMERA_CONFIG_CREATE_REQUEST
});

export const CAMERA_CONFIG_CREATE_ERROR = 'CAMERA_CONFIG_CREATE_ERROR';
export const cameraConfigCreateError = (error) => ({
    type: CAMERA_CONFIG_CREATE_ERROR,
    error,
});

export const CAMERA_CONFIG_CREATE_SUCCESS = 'CAMERA_CONFIG_CREATE_SUCCESS';
export const cameraConfigCreateSuccess = (cameraConfig) => ({
    type: CAMERA_CONFIG_CREATE_SUCCESS,
    cameraConfig
});

export const CAMERA_CONFIG_REMOVE_REQUEST = 'CAMERA_CONFIG_REMOVE_REQUEST';
export const cameraConfigRemoveRequest = (_id) => ({
    type: CAMERA_CONFIG_REMOVE_REQUEST,
    _id
});

export const CAMERA_CONFIG_REMOVE_ERROR = 'CAMERA_CONFIG_REMOVE_ERROR';
export const cameraConfigRemoveError = (error) => ({
    type: CAMERA_CONFIG_REMOVE_ERROR,
    error,
});

export const CAMERA_CONFIG_REMOVE_SUCCESS = 'CAMERA_CONFIG_REMOVE_SUCCESS';
export const cameraConfigRemoveSuccess = (_id) => ({
    type: CAMERA_CONFIG_REMOVE_SUCCESS,
    _id
});

export const CAMERA_CONFIG_FETCH_REQUEST = 'CAMERA_CONFIG_FETCH_REQUEST';
export const cameraConfigFetchRequest = () => ({
    type: CAMERA_CONFIG_FETCH_REQUEST,
});

export const CAMERA_CONFIG_FETCH_ERROR = 'CAMERA_CONFIG_FETCH_ERROR';
export const cameraConfigFetchError = (error) => ({
    type: CAMERA_CONFIG_FETCH_ERROR,
    error,
});

export const CAMERA_CONFIG_FETCH_SUCCESS = 'CAMERA_CONFIG_FETCH_SUCCESS';
export const cameraConfigFetchSuccess = (cameraConfig) => ({
    type: CAMERA_CONFIG_FETCH_SUCCESS,
    cameraConfig,
});

export const CAMERA_CONFIG_SET_SHORT = 'CAMERA_CONFIG_SET_SHORT';
export const cameraConfigSetShort = (description) => ({
    type: CAMERA_CONFIG_SET_SHORT,
    shortDescription: description
});

export const CAMERA_CONFIG_SET_DESCRIPTION = 'CAMERA_CONFIG_SET_DESCRIPTION';
export const cameraConfigSetDescription = (description) => ({
    type: CAMERA_CONFIG_SET_DESCRIPTION,
    description,
});

export const CAMERA_CONFIG_SET_MANUFACTURER = 'CAMERA_CONFIG_SET_MANUFACTURER';
export const cameraConfigSetManufacturer = (manufacturer) => ({
    type: CAMERA_CONFIG_SET_MANUFACTURER,
    manufacturer,
});

export const CAMERA_CONFIG_SET_MODEL = 'CAMERA_CONFIG_SET_MODEL';
export const cameraConfigSetModel = (model) => ({
    type: CAMERA_CONFIG_SET_MODEL,
    model,
});

export const CAMERA_CONFIG_SET_DEVICE_VERSION = 'CAMERA_CONFIG_SET_DEVICE_VERSION';
export const cameraConfigSetDeviceVersion = (deviceVersion) => ({
    type: CAMERA_CONFIG_SET_DEVICE_VERSION,
    deviceVersion,
});

export const CAMERA_CONFIG_SET_SN = 'CAMERA_CONFIG_SET_SN';
export const cameraConfigSetSN = (sn) => ({
    type: CAMERA_CONFIG_SET_SN,
    sn,
});

export const CAMERA_CONFIG_SET_GPHOTO2_CONFIG = 'CAMERA_CONFIG_SET_GPHOTO2_CONFIG';
export const cameraConfigSetGphoto2Config = () => ({
    type: CAMERA_CONFIG_SET_GPHOTO2_CONFIG,
});

export const CAMERA_CONFIG_SAVE_REQUEST = 'CAMERA_CONFIG_SAVE_REQUEST';
export const cameraConfigSaveRequest = (cameraConfig) => ({
    type: CAMERA_CONFIG_SAVE_REQUEST,
    cameraConfig
});

export const CAMERA_CONFIG_SAVE_ERROR = 'CAMERA_CONFIG_SAVE_ERROR';
export const cameraConfigSaveError = (error) => ({
    type: CAMERA_CONFIG_SAVE_ERROR,
    error
});

export const CAMERA_CONFIG_SAVE_SUCCESS = 'CAMERA_CONFIG_SAVE_SUCCESS';
export const cameraConfigSaveSuccess = (_id) => ({
    type: CAMERA_CONFIG_SAVE_SUCCESS,
    _id
});

export const CAMERA_CONFIG_LOAD_SAVED_REQUEST = 'CAMERA_CONFIG_LOAD_SAVED_REQUEST';
export const cameraConfigLoadSavedRequest = () => ({
    type: CAMERA_CONFIG_LOAD_SAVED_REQUEST,
});

export const CAMERA_CONFIG_LOAD_SAVED_ERROR = 'CAMERA_CONFIG_LOAD_SAVED_ERROR';
export const cameraConfigLoadSavedError = (error) => ({
    type: CAMERA_CONFIG_LOAD_SAVED_ERROR,
    error
});

export const CAMERA_CONFIG_LOAD_SAVED_SUCCESS = 'CAMERA_CONFIG_LOAD_SAVED_SUCCESS';
export const cameraConfigLoadSavedSuccess = (cameraConfigs) => ({
    type: CAMERA_CONFIG_LOAD_SAVED_SUCCESS,
    cameraConfigs 
});

export const CAMERA_CONFIG_SET_EDITOR_OPEN = 'CAMERA_CONFIG_SET_EDITOR_OPEN';
export const cameraConfigSetEditorOpen = (open) => ({
    type: CAMERA_CONFIG_SET_EDITOR_OPEN,
    isEditorOpen: open
});

export const CAMERA_CONFIG_SET_LOAD_DIALOG_OPEN = "CAMERA_CONFIG_SET_LOAD_DIALOG_OPEN";
export const cameraConfigSetLoadDialogOpen = (open) => ({
    type: CAMERA_CONFIG_SET_LOAD_DIALOG_OPEN,
    isLoadDialogOpen: open
});

export const CAMERA_CONFIG_SET_ENTRY_VALUE = 'CAMERA_CONFIG_SET_ENTRY_VALUE';
export const cameraConfigSetEntryValue = (eid,value) => ({
    type: CAMERA_CONFIG_SET_ENTRY_VALUE,
    id: eid,
    value
});

export const CAMERA_CONFIG_RESET_STALE_FLAG = 'CAMERA_CONFIG_RESET_STALE_FLAG';
export const cameraConfigResetStaleFlag = (eids) => ({
    type: CAMERA_CONFIG_RESET_STALE_FLAG,
    ids: eids
});

export const CAMERA_CONFIG_LOAD_SETTINGS_REQUEST = 'CAMERA_CONFIG_LOAD_SETTINGS_REQUEST';
export const cameraConfigLoadSettingsRequest = (camIndex) => ({
    type: CAMERA_CONFIG_LOAD_SETTINGS_REQUEST,
    camIndex
});

export const CAMERA_CONFIG_LOAD_SETTINGS_ERROR = 'CAMERA_CONFIG_LOAD_SETTINGS_ERROR';
export const cameraConfigLoadSettingsError = (error) => ({
    type: CAMERA_CONFIG_LOAD_SETTINGS_ERROR,
    error 
});

export const CAMERA_CONFIG_LOAD_SETTINGS_SUCCESS = 'CAMERA_CONFIG_LOAD_SETTINGS_SUCCESS';
export const cameraConfigLoadSettingsSuccess = (settings) => ({
    type: CAMERA_CONFIG_LOAD_SETTINGS_SUCCESS,
    settings
});

export const CAMERA_CONFIG_APPLY_SETTINGS_REQUEST = 'CAMERA_CONFIG_APPLY_SETTINGS_REQUEST';
export const cameraConfigApplySettingsRequest = (camIndex) => ({
    type: CAMERA_CONFIG_APPLY_SETTINGS_REQUEST,
    camIndex
});

export const CAMERA_CONFIG_APPLY_SETTINGS_ERROR = 'CAMERA_CONFIG_APPLY_SETTINGS_ERROR';
export const cameraConfigApplySettingsError = (error) => ({
    type: CAMERA_CONFIG_APPLY_SETTINGS_ERROR,
    error 
});

export const CAMERA_CONFIG_APPLY_SETTINGS_SUCCESS = 'CAMERA_CONFIG_APPLY_SETTINGS_SUCCESS';
export const cameraConfigApplySettingsSuccess = () => ({
    type: CAMERA_CONFIG_APPLY_SETTINGS_SUCCESS
});

export const CAMERA_CAPTURE_REQUEST = 'CAMERA_CAPTURE_REQUEST';
export const cameraCaptureRequest = () => ({
    type: CAMERA_CAPTURE_REQUEST
});

export const CAMERA_CAPTURE_ERROR = 'CAMERA_CAPTURE_ERROR';
export const cameraCaptureError = (error) => ({
    type: CAMERA_CAPTURE_ERROR,
    error 
});

export const CAMERA_CAPTURE_SUCCESS = 'CAMERA_CAPTURE_SUCCESS';
export const cameraCaptureSuccess = () => ({
    type: CAMERA_CAPTURE_SUCCESS
});

/* CameraConfig thunks */
export const cameraConfigCreate = (userId, projectId, templateId=undefined) => dispatch => {
    dispatch(cameraConfigCreateRequest());
    return(fetchAwesomO({
        url: '/api/camera/create',
        method: 'POST',
        body: {userId: userId,
              projectId: projectId,
              templateId: templateId}})
    .then(response => response.json(),
          error => dispatch(cameraConfigCreateError(error)))
    .then( cameraConfig => dispatch(cameraConfigCreateSuccess(cameraConfig))));
};

export const cameraConfigFetch = _id => dispatch => {
    dispatch(cameraConfigFetchRequest(_id));
    return(fetchAwesomO({url: '/api/camera/get/'+_id})
    .then(response => response.json(),
          error => dispatch(cameraConfigFetchError(error)))
    .then( cameraConfig => dispatch(cameraConfigFetchSuccess(cameraConfig))));
};

const cameraConfigSaveHelper = (saveType,cameraConfig,dispatch,getState) => {
    let gphoto2Config = JSON.stringify(undefined);
    if( cameraConfig.configs && (cameraConfig.configs !== {}) ) {
        gphoto2Config = JSON.stringify({ 'main': cameraSettings2Gphoto2Config(cameraConfig.configs, cameraConfig.rootid) });
    }
    dispatch(cameraConfigSaveRequest());
    return(fetchAwesomO({
        url: '/api/camera/'+saveType, 
        method: 'POST', 
        body: {...cameraConfig,
                gphoto2Config: gphoto2Config}})
        .then(  response => response.json(),
                error => dispatch(cameraConfigSaveError(error)) )
        .then( cameraConfig => {
            let camId = cameraConfig._id;
            dispatch(cameraConfigSaveSuccess(camId)); 
            switch( saveType) {
                case 'saveas': //saveas will generate a new storage config, and need to update the project accoringly
                    dispatch(projectSetCameraConfig(camId));
                    dispatch(projectSave(getState().project)); //Save the project automatically
                    break;
                default:
                    break;
            }
        }));
}

export const cameraConfigSave = (cameraConfig) => (dispatch,getState) => {
    return(cameraConfigSaveHelper('save',cameraConfig,dispatch,getState));
}

export const cameraConfigSaveAs = (cameraConfig) => (dispatch,getState) => {
    return(cameraConfigSaveHelper('saveas',cameraConfig,dispatch,getState));
}

export const cameraConfigLoadSaved = userId => dispatch => {
    dispatch(cameraConfigLoadSavedRequest());
    return(fetchAwesomO({url: '/api/camera/load/'+userId})
    .then( response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => dispatch(cameraConfigLoadSavedError(error))
    )
    .then(cameraConfigs =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(cameraConfigLoadSavedSuccess(cameraConfigs))
    ));
};

export const cameraConfigLoad = (camera) => (dispatch,getState) => {
    dispatch(cameraConfigFetchSuccess(camera)); 
    dispatch(projectSetCameraConfig(camera._id));
    dispatch(projectSave(getState().project)); //Save the project automatically upon a change
}

export const cameraConfigRemove = (_id, userId, projectId) => dispatch => {
    dispatch(cameraConfigRemoveRequest(_id));
    return(fetchAwesomO({
        url: '/api/camera/remove',
        method: 'POST',
        body: {
            _id,
            userId,
            projectId
        }})
    .then(response => response.json(),
          error => dispatch(cameraConfigRemoveError(error)))
    .then( _id => dispatch(cameraConfigRemoveSuccess(_id))));
};

export const cameraConfigLoadSettings = (camIndex) => dispatch => {
    dispatch(cameraConfigLoadSettingsRequest(camIndex));
    return(fetchAwesomO({url: '/api/camera/settings/'+camIndex})
    .then(response => response.json(),
          error => dispatch(cameraConfigLoadSettingsError(error)))
    .then( camSettings => dispatch(cameraConfigLoadSettingsSuccess(camSettings))));
}

export const cameraConfigApplySettings = (camIndex,camConfigs) => dispatch => {
    dispatch(cameraConfigApplySettingsRequest(camIndex));
    /* Only update the entries marked 'stale' */
    let updates = Object.keys(camConfigs)
                    .filter( k => camConfigs[k].stale )
                    .map( k => ({ id: camConfigs[k].id,
                                 name: camConfigs[k].keyId,
                                 value: camConfigs[k].entry.value }) );
    return(fetchAwesomO({url: '/api/camera/settings',
                         method: 'POST',
                         body: { camIndex: camIndex, updates: updates } })
                .then(response => response.json(),
                      error => dispatch(cameraConfigApplySettingsError(error)))
                .then(updateIds => {
                    dispatch(cameraConfigResetStaleFlag(updateIds)); //Reset stale flags on those entries that did update successfully
                    dispatch(cameraConfigApplySettingsSuccess());
                }));
}


export const cameraCapture = () => dispatch => {
    dispatch(cameraCaptureRequest());
    /* Only update the entries marked 'stale' */
    return(fetchAwesomO({url: '/api/camera/capture'})
                .then(response => dispatch(cameraCaptureSuccess()),
                      error => dispatch(cameraCaptureError(error)))
    );
}

//Experimental Config
export const EXPERIMENT_CONFIG_INIT = 'EXPERIMENT_CONFIG_INIT';
export const experimentConfigInit = () => ({
    type: EXPERIMENT_CONFIG_INIT,
});

export const EXPERIMENT_CONFIG_CREATE_REQUEST = 'EXPERIMENT_CONFIG_CREATE_REQUEST';
export const experimentConfigCreateRequest = () => ({
    type: EXPERIMENT_CONFIG_CREATE_REQUEST
});

export const EXPERIMENT_CONFIG_CREATE_ERROR = 'EXPERIMENT_CONFIG_CREATE_ERROR';
export const experimentConfigCreateError = (error) => ({
    type: EXPERIMENT_CONFIG_CREATE_ERROR,
    error,
});

export const EXPERIMENT_CONFIG_CREATE_SUCCESS = 'EXPERIMENT_CONFIG_CREATE_SUCCESS';
export const experimentConfigCreateSuccess = (experimentConfig) => ({
    type: EXPERIMENT_CONFIG_CREATE_SUCCESS,
    experimentConfig,
});

export const EXPERIMENT_CONFIG_REMOVE_REQUEST = 'EXPERIMENT_CONFIG_REMOVE_REQUEST';
export const experimentConfigRemoveRequest = (_id) => ({
    type: EXPERIMENT_CONFIG_REMOVE_REQUEST,
    _id
});

export const EXPERIMENT_CONFIG_REMOVE_ERROR = 'EXPERIMENT_CONFIG_REMOVE_ERROR';
export const experimentConfigRemoveError = (error) => ({
    type: EXPERIMENT_CONFIG_REMOVE_ERROR,
    error
});

export const EXPERIMENT_CONFIG_REMOVE_SUCCESS = 'EXPERIMENT_CONFIG_REMOVE_SUCCESS';
export const experimentConfigRemoveSuccess = (_id) => ({
    type: EXPERIMENT_CONFIG_REMOVE_SUCCESS,
    _id
});

export const EXPERIMENT_CONFIG_FETCH_REQUEST = 'EXPERIMENT_CONFIG_FETCH_REQUEST';
export const experimentConfigFetchRequest = (id) => ({
    type: EXPERIMENT_CONFIG_FETCH_REQUEST,
    id,
});

export const EXPERIMENT_CONFIG_FETCH_ERROR = 'EXPERIMENT_CONFIG_FETCH_ERROR';
export const experimentConfigFetchError = (error) => ({
    type: EXPERIMENT_CONFIG_FETCH_ERROR,
    error,
});

export const EXPERIMENT_CONFIG_FETCH_SUCCESS = 'EXPERIMENT_CONFIG_FETCH_SUCCESS';
export const experimentConfigFetchSuccess = (experimentConfig) => ({
    type: EXPERIMENT_CONFIG_FETCH_SUCCESS,
    experimentConfig,
});

export const EXPERIMENT_CONFIG_SET_SHORT = 'EXPERIMENT_CONFIG_SET_SHORT';
export const experimentConfigSetShort = (description) => ({
    type: EXPERIMENT_CONFIG_SET_SHORT,
    shortDescription: description
});

export const EXPERIMENT_CONFIG_SET_DATETIME = 'EXPERIMENT_CONFIG_SET_DATETIME';
export const experimentConfigSetDatetime = (appendDT) => ({
    type: EXPERIMENT_CONFIG_SET_DATETIME,
    datetime: appendDT,
});

export const EXPERIMENT_CONFIG_SET_RENAME = 'EXPERIMENT_CONFIG_SET_RENAME';
export const experimentConfigSetRename = (renameFile) => ({
    type: EXPERIMENT_CONFIG_SET_RENAME,
    rename: renameFile,
});

export const EXPERIMENT_CONFIG_SET_IMAGE_META = 'EXPERIMENT_CONFIG_SET_IMAGE_META';
export const experimentConfigSetImageMeta = (embedImageMeta) => ({
    type: EXPERIMENT_CONFIG_SET_IMAGE_META,
    imageMeta: embedImageMeta,
});

export const EXPERIMENT_CONFIG_SET_FILENAME_FIELDS = 'EXPERIMENT_CONFIG_SET_FILENAME_FIELDS';
export const experimentConfigSetFilenameFields = (filenameFields) => ({
    type: EXPERIMENT_CONFIG_SET_FILENAME_FIELDS,
    filenameFields,
});

export const EXPERIMENT_CONFIG_ADD_FILENAME_FIELD = 'EXPERIMENT_CONFIG_ADD_FILENAME_FIELD';
export const experimentConfigAddFilenameField = (field) => ({
    type: EXPERIMENT_CONFIG_ADD_FILENAME_FIELD,
    field
});

export const EXPERIMENT_CONFIG_REMOVE_FILENAME_FIELD = 'EXPERIMENT_CONFIG_REMOVE_FILENAME_FIELD';
export const experimentConfigRemoveFilenameField = (field) => ({
    type: EXPERIMENT_CONFIG_REMOVE_FILENAME_FIELD,
    field
});

export const EXPERIMENT_CONFIG_CLEAR_FILENAME_FIELDS = 'EXPERIMENT_CONFIG_CLEAR_FILENAME_FIELDS';
export const experimentConfigClearFilenameFields = () => ({
    type: EXPERIMENT_CONFIG_CLEAR_FILENAME_FIELDS
});

//Add plate
export const EXPERIMENT_CONFIG_ADD_PLATE = 'EXPERIMENT_CONFIG_ADD_PLATE';
export const experimentConfigAddPlate = (row,col,meta) => ({
    type: EXPERIMENT_CONFIG_ADD_PLATE,
    row,
    col,
    meta,
});

export const EXPERIMENT_CONFIG_REMOVE_PLATE = 'EXPERIMENT_CONFIG_REMOVE_PLATE';
export const experimentConfigRemovePlate = (row,col) => ({
    type: EXPERIMENT_CONFIG_REMOVE_PLATE,
    row,
    col
});

export const EXPERIMENT_CONFIG_CLEAR_PLATE_META = 'EXPERIMENT_CONFIG_CLEAR_PLATE_META';
export const experimentConfigClearPlateMeta = () => ({
    type: EXPERIMENT_CONFIG_CLEAR_PLATE_META,
});

export const EXPERIMENT_CONFIG_SAVE_REQUEST = 'EXPERIMENT_CONFIG_SAVE_REQUEST';
export const experimentConfigSaveRequest = () => ({
    type: EXPERIMENT_CONFIG_SAVE_REQUEST,
});

export const EXPERIMENT_CONFIG_SAVE_ERROR = 'EXPERIMENT_CONFIG_SAVE_ERROR';
export const experimentConfigSaveError = (error) => ({
    type: EXPERIMENT_CONFIG_SAVE_ERROR,
    error,
});

export const EXPERIMENT_CONFIG_SAVE_SUCCESS = 'EXPERIMENT_CONFIG_SAVE_SUCCESS';
export const experimentConfigSaveSuccess = (_id) => ({
    type: EXPERIMENT_CONFIG_SAVE_SUCCESS,
    _id,
});

export const EXPERIMENT_CONFIG_LOAD_SAVED_REQUEST = 'EXPERIMENT_CONFIG_LOAD_SAVED_REQUEST';
export const experimentConfigLoadSavedRequest = () => ({
    type: EXPERIMENT_CONFIG_LOAD_SAVED_REQUEST,
});

export const EXPERIMENT_CONFIG_LOAD_SAVED_ERROR = 'EXPERIMENT_CONFIG_LOAD_SAVED_ERROR';
export const experimentConfigLoadSavedError = (error) => ({
    type: EXPERIMENT_CONFIG_LOAD_SAVED_ERROR,
    error
});

export const EXPERIMENT_CONFIG_LOAD_SAVED_SUCCESS = 'EXPERIMENT_CONFIG_LOAD_SAVED_SUCCESS';
export const experimentConfigLoadSavedSuccess = (experimentConfigs) => ({
    type: EXPERIMENT_CONFIG_LOAD_SAVED_SUCCESS,
    experimentConfigs 
});

export const EXPERIMENT_CONFIG_SET_EDITOR_OPEN = 'EXPERIMENT_CONFIG_SET_EDITOR_OPEN';
export const experimentConfigSetEditorOpen = (open) => ({
    type: EXPERIMENT_CONFIG_SET_EDITOR_OPEN,
    isEditorOpen: open
});

export const EXPERIMENT_CONFIG_SET_LOAD_DIALOG_OPEN = "EXPERIMENT_CONFIG_SET_LOAD_DIALOG_OPEN";
export const experimentConfigSetLoadDialogOpen = (open) => ({
    type: EXPERIMENT_CONFIG_SET_LOAD_DIALOG_OPEN,
    isLoadDialogOpen: open
});

/* Experimental Configuration Thunks */
export const experimentConfigCreate = (userId, projectId, templateId=undefined) => dispatch => {
    let fetchURL;
    dispatch(experimentConfigCreate);
    fetchURL = '/api/experiment/create';
    return(fetchAwesomO({
            url: fetchURL,
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body: {userId: userId,
                  projectId: projectId,
                  templateId: templateId}})
    .then( response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => dispatch(experimentConfigCreateError(error))
    )
    .then(experimentConfig =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(experimentConfigCreateSuccess(experimentConfig))
    ));

};

export const experimentConfigFetch = (_id) => dispatch => {
    let fetchURL;
    dispatch(experimentConfigFetchRequest(_id));
    fetchURL = '/api/experiment/get/' + _id;
    return(fetchAwesomO({url: fetchURL})
    .then( response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => dispatch(experimentConfigFetchError(error))
    )
    .then(experimentConfig =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(experimentConfigFetchSuccess(experimentConfig))
    ));

};

const experimentConfigSaveHelper = (saveType,experimentConfig,dispatch,getState) => {
    dispatch(experimentConfigSaveRequest());
    return(fetchAwesomO({
        url: '/api/experiment/'+saveType, 
        method: 'POST', 
        body: experimentConfig})
        .then(  response => response.json(),
                error => dispatch(experimentConfigSaveError(error)) )
        .then( experimentConfig => {
            let eId = experimentConfig._id;
            dispatch(experimentConfigSaveSuccess(eId)); 
            switch( saveType) {
                case 'saveas': //saveas will generate a new storage config, and need to update the project accoringly
                    dispatch(projectSetExperimentConfig(eId));
                    dispatch(projectSave(getState().project)); //Save the project automatically
                    break;
                default:
                    break;
            }
        }));
};

export const experimentConfigSave = (experimentConfig) => (dispatch,getState) => {
    return(experimentConfigSaveHelper('save',experimentConfig,dispatch,getState));
};

export const experimentConfigSaveAs = (experimentConfig) => (dispatch,getState) => {
    return(experimentConfigSaveHelper('saveas',experimentConfig,dispatch,getState));
};

export const experimentConfigLoadSaved = userId => dispatch => {
    dispatch(experimentConfigLoadSavedRequest());
    return(fetchAwesomO({url: '/api/experiment/load/'+userId})
    .then( response => response.json(),
        error => dispatch(experimentConfigLoadSavedError(error))
    )
    .then(experimentConfigs =>
        dispatch(experimentConfigLoadSavedSuccess(experimentConfigs))
    ));
};

export const experimentConfigLoad = (experiment) => (dispatch,getState) => {
    dispatch(experimentConfigFetchSuccess(experiment)); 
    dispatch(projectSetExperimentConfig(experiment._id));
    dispatch(projectSave(getState().project)); //Save the project automatically upon a change
};

export const experimentConfigRemove = (_id, userId, projectId) => dispatch => {
    dispatch(experimentConfigRemoveRequest(_id));
    return(fetchAwesomO({
        url: '/api/experiment/remove/',
        method: 'POST',
        body: {
            userId,
            projectId}})
    .then(  response => response.json(),
            error => dispatch(experimentConfigRemoveError(error)) )
    .then(_id => dispatch(experimentConfigRemoveSuccess(_id))));
}

/*
 * Storage configuration
 */
export const STORAGE_CONFIG_INIT = 'STORAGE_CONFIG_INIT';
export const storageConfigInit = () => ({
    type: STORAGE_CONFIG_INIT,
});

export const STORAGE_CONFIG_CREATE_REQUEST = 'STORAGE_CONFIG_CREATE_REQUEST';
export const storageConfigCreateRequest = () => ({
    type: STORAGE_CONFIG_CREATE_REQUEST
});

export const STORAGE_CONFIG_CREATE_ERROR = 'STORAGE_CONFIG_CREATE_ERROR';
export const storageConfigCreateError = (error) => ({
    type: STORAGE_CONFIG_CREATE_ERROR,
    error
});

export const STORAGE_CONFIG_CREATE_SUCCESS = 'STORAGE_CONFIG_CREATE_SUCCESS';
export const storageConfigCreateSuccess = (storageConfig) => ({
    type: STORAGE_CONFIG_CREATE_SUCCESS,
    storageConfig
});

export const STORAGE_CONFIG_REMOVE_REQUEST = 'STORAGE_CONFIG_REMOVE_REQUEST';
export const storageConfigRemoveRequest = (_id) => ({
    type: STORAGE_CONFIG_REMOVE_REQUEST,
    _id
});

export const STORAGE_CONFIG_REMOVE_ERROR = 'STORAGE_CONFIG_REMOVE_ERROR';
export const storageConfigRemoveError = (error) => ({
    type: STORAGE_CONFIG_REMOVE_ERROR,
    error
});

export const STORAGE_CONFIG_REMOVE_SUCCESS = 'STORAGE_CONFIG_REMOVE_SUCCESS';
export const storageConfigRemoveSuccess = (_id) => ({
    type: STORAGE_CONFIG_REMOVE_SUCCESS,
    _id
});

export const STORAGE_CONFIG_FETCH_REQUEST = 'STORAGE_CONFIG_FETCH_REQUEST';
export const storageConfigFetchRequest = (id) => ({
    type: STORAGE_CONFIG_FETCH_REQUEST,
    id
});

export const STORAGE_CONFIG_FETCH_ERROR = 'STORAGE_CONFIG_FETCH_ERROR';
export const storageConfigFetchError = (error) => ({
    type: STORAGE_CONFIG_FETCH_ERROR,
    error
});

export const STORAGE_CONFIG_FETCH_SUCCESS = 'STORAGE_CONFIG_FETCH_SUCCESS';
export const storageConfigFetchSuccess = (storageConfig) => ({
    type: STORAGE_CONFIG_FETCH_SUCCESS,
    storageConfig
});

export const STORAGE_CONFIG_SET_SHORT = 'STORAGE_CONFIG_SET_SHORT';
export const storageConfigSetShort = (description) => ({
    type: STORAGE_CONFIG_SET_SHORT,
    shortDescription: description
});

export const STORAGE_CONFIG_SET_TYPE = 'STORAGE_CONFIG_SET_TYPE';
export const storageConfigSetType = (storageType) => ({
    type: STORAGE_CONFIG_SET_TYPE,
    storageType
});

export const STORAGE_CONFIG_SET_PARAMS = 'STORAGE_CONFIG_SET_PARAMS';
export const storageConfigSetParams = (params) => ({
    type: STORAGE_CONFIG_SET_PARAMS,
    params
});

export const STORAGE_CONFIG_SAVE_REQUEST = 'STORAGE_CONFIG_SAVE_REQUEST';
export const storageConfigSaveRequest = () => ({
    type: STORAGE_CONFIG_SAVE_REQUEST,
});

export const STORAGE_CONFIG_SAVE_ERROR = 'STORAGE_CONFIG_SAVE_ERROR';
export const storageConfigSaveError = (error) => ({
    type: STORAGE_CONFIG_SAVE_ERROR,
    error
});

export const STORAGE_CONFIG_SAVE_SUCCESS = 'STORAGE_CONFIG_SAVE_SUCCESS';
export const storageConfigSaveSuccess = (_id) => ({
    type: STORAGE_CONFIG_SAVE_SUCCESS,
    _id
});

export const STORAGE_CONFIG_LOAD_SAVED_REQUEST = 'STORAGE_CONFIG_LOAD_SAVED_REQUEST';
export const storageConfigLoadSavedRequest = () => ({
    type: STORAGE_CONFIG_LOAD_SAVED_REQUEST,
});

export const STORAGE_CONFIG_LOAD_SAVED_ERROR = 'STORAGE_CONFIG_LOAD_SAVED_ERROR';
export const storageConfigLoadSavedError = (error) => ({
    type: STORAGE_CONFIG_LOAD_SAVED_ERROR,
    error
});

export const STORAGE_CONFIG_LOAD_SAVED_SUCCESS = 'STORAGE_CONFIG_LOAD_SAVED_SUCCESS';
export const storageConfigLoadSavedSuccess = (storageConfigs) => ({
    type: STORAGE_CONFIG_LOAD_SAVED_SUCCESS,
    storageConfigs 
});

export const STORAGE_CONFIG_SET_EDITOR_OPEN = 'STORAGE_CONFIG_SET_EDITOR_OPEN';
export const storageConfigSetEditorOpen = (open) => ({
    type: STORAGE_CONFIG_SET_EDITOR_OPEN,
    isEditorOpen: open 
});

export const STORAGE_CONFIG_SET_LOAD_DIALOG_OPEN = "STORAGE_CONFIG_SET_LOAD_DIALOG_OPEN";
export const storageConfigSetLoadDialogOpen = (open) => ({
    type: STORAGE_CONFIG_SET_LOAD_DIALOG_OPEN,
    isLoadDialogOpen: open
});

export const STORAGE_CONFIG_GET_SUPPORTED_TYPES_REQUEST = 'STORAGE_CONFIG_GET_SUPPORTED_TYPES_REQUEST';
export const storageConfigGetSupportedTypesRequest = () => ({
    type: STORAGE_CONFIG_GET_SUPPORTED_TYPES_REQUEST
});

export const STORAGE_CONFIG_GET_SUPPORTED_TYPES_ERROR = 'STORAGE_CONFIG_GET_SUPPORTED_TYPES_ERROR';
export const storageConfigGetSupportedTypesError = (error) => ({
    type: STORAGE_CONFIG_GET_SUPPORTED_TYPES_ERROR,
    error
});

export const STORAGE_CONFIG_GET_SUPPORTED_TYPES_SUCCESS = 'STORAGE_CONFIG_GET_SUPPORTED_TYPES_SUCCESS';
export const storageConfigGetSupportedTypesSuccess = (types) => ({
    type: STORAGE_CONFIG_GET_SUPPORTED_TYPES_SUCCESS,
    supportedTypes: types
});

export const STORAGE_CONFIG_GET_SUPPORTED_PARAMS_REQUEST = 'STORAGE_CONFIG_GET_SUPPORTED_PARAMS_REQUEST';
export const storageConfigGetSupportedParamsRequest = () => ({
    type: STORAGE_CONFIG_GET_SUPPORTED_PARAMS_REQUEST
});

export const STORAGE_CONFIG_GET_SUPPORTED_PARAMS_ERROR = 'STORAGE_CONFIG_GET_SUPPORTED_PARAMS_ERROR';
export const storageConfigGetSupportedParamsError = (error) => ({
    type: STORAGE_CONFIG_GET_SUPPORTED_PARAMS_ERROR,
    error
});

export const STORAGE_CONFIG_GET_SUPPORTED_PARAMS_SUCCESS = 'STORAGE_CONFIG_GET_SUPPORTED_PARAMS_SUCCESS';
export const storageConfigGetSupportedParamsSuccess = (params) => ({
    type: STORAGE_CONFIG_GET_SUPPORTED_PARAMS_SUCCESS,
    supportedParams: params 
});


/* StorageConfig Thunks */

export const storageConfigCreate = (userId, projectId, templateId = undefined) => dispatch => {
    dispatch(storageConfigCreateRequest());
    return(fetchAwesomO({
        url:'/api/storage/create/',
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: {userId: userId,
              projectId: projectId,
              templateId: templateId}})
    .then( response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => dispatch(storageConfigCreateError(error))
    )
    .then(storageConfig =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(storageConfigCreateSuccess(storageConfig))
    ));
}

export const storageConfigFetch = (_id) => dispatch => {
    dispatch(storageConfigFetchRequest(_id));
    return(fetchAwesomO({url: '/api/storage/get/'+_id})
    .then( response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => dispatch(storageConfigFetchError(error))
    )
    .then(storageConfig =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(storageConfigFetchSuccess(storageConfig))
    ));
}

export const storageConfigLoadSaved = userId => dispatch => {
    dispatch(storageConfigLoadSavedRequest());
    return(fetchAwesomO({url: '/api/storage/load/'+userId})
    .then( response => response.json(),
        error => dispatch(storageConfigLoadSavedError(error))
    )
    .then(storageConfigs =>
        dispatch(storageConfigLoadSavedSuccess(storageConfigs))
    ));
};

export const storageConfigLoad = (storage) => (dispatch,getState) => {
    dispatch(storageConfigFetchSuccess(storage)); 
    dispatch(projectClearStorageConfigs());
    dispatch(projectAddStorageConfig(storage._id));
    dispatch(projectSave(getState().project)); //Save the project automatically upon a change
};

const storageConfigSaveHelper = (saveType,storageConfig,dispatch,getState) => {
    dispatch(storageConfigSaveRequest());
    return(fetchAwesomO({
        url: '/api/storage/'+saveType, 
        method: 'POST', 
        body: storageConfig})
        .then(  response => response.json(),
                error => dispatch(storageConfigSaveError(error)) )
        .then( storageConfig => {
            let sId = storageConfig._id;
            dispatch(storageConfigSaveSuccess(sId)); 
            switch( saveType) {
                case 'saveas': //saveas will generate a new storage config, and need to update the project accoringly
                    dispatch(projectClearStorageConfigs());
                    dispatch(projectAddStorageConfig(sId));
                    dispatch(projectSave(getState().project)); //Save the project automatically
                    break;
                default:
                    break;
            }
        }));
}
export const storageConfigSave = (storageConfig) => (dispatch,getState) => {
    return(storageConfigSaveHelper('save',storageConfig,dispatch,getState));
}

export const storageConfigSaveAs = (storageConfig) => (dispatch,getState) => {
    return(storageConfigSaveHelper('saveas',storageConfig,dispatch,getState));
}

export const storageConfigRemove = (_id,userId,projectId) => dispatch => {
    dispatch(storageConfigRemoveRequest(_id));
    return(fetchAwesomO({
        url: '/api/storage/remove',
        method: 'POST',
        body: {
            _id,
            userId,
            projectId}}) 
        .then(  response => response.json(),
                error => dispatch(storageConfigRemoveError(error)) )
        .then(json => dispatch(storageConfigRemoveSuccess(json._id))));
}

export const storageConfigGetSupportedTypes = () => dispatch => {
    dispatch(storageConfigGetSupportedTypesRequest());
    return(fetchAwesomO({url: '/api/storage/types'})
    .then( response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => dispatch(storageConfigGetSupportedTypesError(error))
    )
    .then(types =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(storageConfigGetSupportedTypesSuccess(types.types))
    ));
}

export const storageConfigGetSupportedParams = () => dispatch => {
    dispatch(storageConfigGetSupportedParamsRequest());
    return(fetchAwesomO({url: '/api/storage/params'})
    .then( response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => dispatch(storageConfigGetSupportedParamsError(error))
    )
    .then(params =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(storageConfigGetSupportedParamsSuccess(params))
    ));
}

/*
 * Route configuration
 */
export const ROUTE_CONFIG_INIT = 'ROUTE_CONFIG_INIT';
export const routeConfigInit = () => ({
    type: ROUTE_CONFIG_INIT,
});

export const ROUTE_CONFIG_CREATE_REQUEST = 'ROUTE_CONFIG_CREATE_REQUEST';
export const routeConfigCreateRequest = () => ({
    type: ROUTE_CONFIG_CREATE_REQUEST
});

export const ROUTE_CONFIG_CREATE_ERROR = 'ROUTE_CONFIG_CREATE_ERROR';
export const routeConfigCreateError = (error) => ({
    type: ROUTE_CONFIG_CREATE_ERROR,
    error
});

export const ROUTE_CONFIG_CREATE_SUCCESS = 'ROUTE_CONFIG_CREATE_SUCCESS';
export const routeConfigCreateSuccess = (routeConfig) => ({
    type: ROUTE_CONFIG_CREATE_SUCCESS,
    routeConfig
});

export const ROUTE_CONFIG_FETCH_REQUEST = 'ROUTE_CONFIG_FETCH_REQUEST';
export const routeConfigFetchRequest = (_id) => ({
    _id,
    type: ROUTE_CONFIG_FETCH_REQUEST
});

export const ROUTE_CONFIG_FETCH_ERROR = 'ROUTE_CONFIG_FETCH_ERROR';
export const routeConfigFetchError = (error) => ({
    type: ROUTE_CONFIG_FETCH_ERROR,
    error
});

export const ROUTE_CONFIG_FETCH_SUCCESS = 'ROUTE_CONFIG_FETCH_SUCCESS';
export const routeConfigFetchSuccess = (routeConfig) => ({
    type: ROUTE_CONFIG_FETCH_SUCCESS,
    routeConfig
});

export const ROUTE_CONFIG_SET_SHORT = 'ROUTE_CONFIG_SET_SHORT';
export const routeConfigSetShort = (description) => ({
    type: ROUTE_CONFIG_SET_SHORT,
    shortDescription: description
});

export const ROUTE_CONFIG_SET_INTERPLATE_DELAY = 'ROUTE_CONFIG_SET_INTERPLATE_DELAY';
export const routeConfigSetInterplateDelay = (seconds) => ({
    type: ROUTE_CONFIG_SET_INTERPLATE_DELAY,
    seconds
});

export const ROUTE_CONFIG_SET_LOOP_DELAY = 'ROUTE_CONFIG_SET_LOOP_DELAY';
export const routeConfigSetLoopDelay = (seconds) => ({
    type: ROUTE_CONFIG_SET_LOOP_DELAY,
    seconds
});

export const ROUTE_CONFIG_SET_STEPS_PER_CM_X = 'ROUTE_CONFIG_SET_STEPS_PER_CM_X';
export const routeConfigSetStepsPerCmX = (steps) => ({
    type: ROUTE_CONFIG_SET_STEPS_PER_CM_X,
    steps
});

export const ROUTE_CONFIG_SET_STEPS_PER_CM_Y = 'ROUTE_CONFIG_SET_STEPS_PER_CM_Y';
export const routeConfigSetStepsPerCmY = (steps) => ({
    type: ROUTE_CONFIG_SET_STEPS_PER_CM_Y,
    steps
});

export const ROUTE_CONFIG_SET_DISTANCE_X = 'ROUTE_CONFIG_SET_DISTANCE_X';
export const routeConfigSetDistanceX = (plateDistanceX) => ({
    type: ROUTE_CONFIG_SET_DISTANCE_X,
    plateDistanceX
});

export const ROUTE_CONFIG_SET_DISTANCE_Y = 'ROUTE_CONFIG_SET_DISTANCE_Y';
export const routeConfigSetDistanceY = (plateDistanceY) => ({
    type: ROUTE_CONFIG_SET_DISTANCE_Y,
    plateDistanceY
});

export const ROUTE_CONFIG_ADD_ROUTE = 'ROUTE_CONFIG_ADD_ROUTE';
export const routeConfigAddRoute = (row, col) => ({
    type: ROUTE_CONFIG_ADD_ROUTE,
    row,
    col
});

export const ROUTE_CONFIG_REMOVE_ROUTE = 'ROUTE_CONFIG_REMOVE_ROUTE';
export const routeConfigRemoveRoute = (row, col) => ({
    type: ROUTE_CONFIG_REMOVE_ROUTE,
    row,
    col
});

export const ROUTE_CONFIG_CLEAR_ROUTE = 'ROUTE_CONFIG_CLEAR_ROUTE';
export const routeConfigClearRoute = () => ({
    type: ROUTE_CONFIG_CLEAR_ROUTE
});

export const ROUTE_CONFIG_SAVE_REQUEST = 'ROUTE_CONFIG_SAVE_REQUEST';
export const routeConfigSaveRequest = () => ({
    type: ROUTE_CONFIG_SAVE_REQUEST
});

export const ROUTE_CONFIG_SAVE_ERROR = 'ROUTE_CONFIG_SAVE_ERROR';
export const routeConfigSaveError = (error) => ({
    type: ROUTE_CONFIG_SAVE_ERROR,
    error
});

export const ROUTE_CONFIG_SAVE_SUCCESS = 'ROUTE_CONFIG_SAVE_SUCCESS';
export const routeConfigSaveSuccess = (_id) => ({
    type: ROUTE_CONFIG_SAVE_SUCCESS,
    _id
});

export const ROUTE_CONFIG_REMOVE_REQUEST = 'ROUTE_CONFIG_REMOVE_REQUEST';
export const routeConfigRemoveRequest = (_id) => ({
    type: ROUTE_CONFIG_REMOVE_REQUEST,
    _id
});

export const ROUTE_CONFIG_REMOVE_ERROR = 'ROUTE_CONFIG_REMOVE_ERROR';
export const routeConfigRemoveError = (error) => ({
    type: ROUTE_CONFIG_REMOVE_ERROR,
    error
});

export const ROUTE_CONFIG_REMOVE_SUCCESS = 'ROUTE_CONFIG_REMOVE_SUCCESS';
export const routeConfigRemoveSuccess = (_id) => ({
    _id,
    type: ROUTE_CONFIG_REMOVE_SUCCESS
});

export const ROUTE_CONFIG_RESET_STALE_FLAG = 'ROUTE_CONFIG_RESET_STALE_FLAG';
export const routeConfigResetStaleFlag = () => ({
    type: ROUTE_CONFIG_RESET_STALE_FLAG
});

export const ROUTE_CONFIG_LOAD_SAVED_REQUEST = 'ROUTE_CONFIG_LOAD_SAVED_REQUEST';
export const routeConfigLoadSavedRequest = () => ({
    type: ROUTE_CONFIG_LOAD_SAVED_REQUEST,
});

export const ROUTE_CONFIG_LOAD_SAVED_ERROR = 'ROUTE_CONFIG_LOAD_SAVED_ERROR';
export const routeConfigLoadSavedError = (error) => ({
    type: ROUTE_CONFIG_LOAD_SAVED_ERROR,
    error
});

export const ROUTE_CONFIG_LOAD_SAVED_SUCCESS = 'ROUTE_CONFIG_LOAD_SAVED_SUCCESS';
export const routeConfigLoadSavedSuccess = (routeConfigs) => ({
    type: ROUTE_CONFIG_LOAD_SAVED_SUCCESS,
    routeConfigs 
});

export const ROUTE_CONFIG_SET_EDITOR_OPEN = 'ROUTE_CONFIG_SET_EDITOR_OPEN';
export const routeConfigSetEditorOpen = (open) => ({
    type: ROUTE_CONFIG_SET_EDITOR_OPEN,
    isEditorOpen: open
});

export const ROUTE_CONFIG_SET_LOAD_DIALOG_OPEN = "ROUTE_CONFIG_SET_LOAD_DIALOG_OPEN";
export const routeConfigSetLoadDialogOpen = (open) => ({
    type: ROUTE_CONFIG_SET_LOAD_DIALOG_OPEN,
    isLoadDialogOpen: open
});

/* Route thunks */
export const routeConfigCreate = (userId, projectId, templateId=undefined) => dispatch => {
    dispatch(routeConfigCreateRequest());
    return(fetchAwesomO({
        url: '/api/route/create',
        method: 'POST',
        body: {
            userId,
            projectId,
            templateId}})
        .then(  response => response.json(),
                error => dispatch(routeConfigCreateError(error)) )
        .then(routeConfig => dispatch(routeConfigCreateSuccess(routeConfig))));
}

export const routeConfigFetch = (_id) => dispatch => {
    dispatch(routeConfigFetchRequest());
    return(fetchAwesomO({url: '/api/route/get/'+_id})
        .then( response => response.json(),
            // Do not use catch, because that will also catch
            // any errors in the dispatch and resulting render,
            // causing a loop of 'Unexpected batch number' errors.
            // https://github.com/facebook/react/issues/6895
            error => dispatch(routeConfigFetchError(error))
        )
        .then(routeConfig  =>
            // We can dispatch many times!
            // Here, we update the app state with the results of the API call.
            dispatch(routeConfigFetchSuccess(routeConfig))
    ));
}

const routeConfigSaveHelper = (saveType,routeConfig,dispatch,getState) => {
    dispatch(routeConfigSaveRequest());
    return(fetchAwesomO({
        url: '/api/route/'+saveType, 
        method: 'POST', 
        body: routeConfig})
        .then(  response => response.json(),
                error => dispatch(routeConfigSaveError(error)) )
        .then( routeConfig => {
            let rId = routeConfig._id;
            dispatch(routeConfigSaveSuccess(rId)); 
            switch( saveType) {
                case 'saveas': //saveas will generate a new storage config, and need to update the project accoringly
                    dispatch(projectSetRouteConfig(rId));
                    dispatch(projectSave(getState().project)); //Save the project automatically
                    break;
                default:
                    break;
            }
        }));
}
export const routeConfigSave = (routeConfig) => (dispatch,getState) => {
    return(routeConfigSaveHelper('save',routeConfig,dispatch,getState));
}

export const routeConfigSaveAs = (routeConfig) => (dispatch,getState) => {
    return(routeConfigSaveHelper('saveas',routeConfig,dispatch,getState));
}

export const routeConfigLoadSaved = userId => dispatch => {
    dispatch(routeConfigLoadSavedRequest());
    return(fetchAwesomO({url: '/api/route/load/'+userId})
    .then( response => response.json(),
        error => dispatch(routeConfigLoadSavedError(error))
    )
    .then(routeConfigs =>
        dispatch(routeConfigLoadSavedSuccess(routeConfigs))
    ));
};

export const routeConfigLoad = (route) => (dispatch,getState) => {
    dispatch(routeConfigFetchSuccess(route)); 
    dispatch(projectSetRouteConfig(route._id));
    dispatch(projectSave(getState().project)); //Save the project automatically upon a change
};

export const routeConfigRemove = (_id, userId, projectId) => dispatch => {
    dispatch(routeConfigRemoveRequest(_id));
    return(fetchAwesomO({
        url: '/api/route/remove',
        method: 'POST',
        body: {
            _id,
            userId,
            projectId}})
        .then(  response => response.json(),
                error => dispatch(routeConfigRemoveError(error)) )
        .then(_id => dispatch(routeConfigRemoveSuccess(_id))));
}

/* Viewport actions */
export const VIEWPORT_SET_CURRENT_PICTURE = "VIEWPORT_SET_CURRENT_PICTURE";
export const viewportSetCurrentPicture = (src) => ({
    type: VIEWPORT_SET_CURRENT_PICTURE,
    src
});

export const VIEWPORT_SET_THUMBNAIL = "VIEWPORT_SET_THUMBNAIL";
export const viewportSetThumbnail = (row,col,src) => ({
    type: VIEWPORT_SET_THUMBNAIL,
    row,
    col,
    src
});

export const VIEWPORT_GET_CURRENT_PICTURE_REQUEST = "VIEWPORT_GET_CURRENT_PICTURE_REQUEST";
export const viewportGetCurrentPictureRequest = () => ({
    type: VIEWPORT_GET_CURRENT_PICTURE_REQUEST
});

export const VIEWPORT_GET_CURRENT_PICTURE_ERROR = "VIEWPORT_GET_CURRENT_PICTURE_ERROR";
export const viewportGetCurrentPictureError = (error) => ({
    type: VIEWPORT_GET_CURRENT_PICTURE_ERROR,
    error
});

export const VIEWPORT_GET_CURRENT_PICTURE_SUCCESS = "VIEWPORT_GET_CURRENT_PICTURE_SUCCESS";
export const viewportGetCurrentPictureSuccess = (src) => ({
    type: VIEWPORT_GET_CURRENT_PICTURE_SUCCESS,
    src
});

export const VIEWPORT_SET_PREVIEW_ENABLED = "VIEWPORT_SET_PREVIEW_ENABLED";
export const viewportSetPreviewEnabled = (enabled) => ({
    type: VIEWPORT_SET_PREVIEW_ENABLED,
    enabled 
});

export const VIEWPORT_GET_PREVIEW_ENABLED_REQUEST = "VIEWPORT_GET_PREVIEW_ENABLED_REQUEST";
export const viewportGetPreviewEnabledRequest = () => ({
    type: VIEWPORT_GET_PREVIEW_ENABLED_REQUEST,
});

export const VIEWPORT_GET_PREVIEW_ENABLED_ERROR = "VIEWPORT_GET_PREVIEW_ENABLED_ERROR";
export const viewportGetPreviewEnabledError = (error) => ({
    type: VIEWPORT_GET_PREVIEW_ENABLED_ERROR,
    error
});

export const VIEWPORT_GET_PREVIEW_ENABLED_SUCCESS = "VIEWPORT_GET_PREVIEW_ENABLED_SUCCESS";
export const viewportGetPreviewEnabledSuccess = (enabled) => ({
    type: VIEWPORT_GET_PREVIEW_ENABLED_SUCCESS,
    enabled
});

export const VIEWPORT_PREVIEW_START_REQUEST = "VIEWPORT_PREVIEW_START_REQUEST";
export const viewportPreviewStartRequest = () => ({
    type: VIEWPORT_PREVIEW_START_REQUEST
});

export const VIEWPORT_PREVIEW_START_ERROR = "VIEWPORT_PREVIEW_START_ERROR";
export const viewportPreviewStartError = (error) => ({
    type: VIEWPORT_PREVIEW_START_ERROR,
    error
});

export const VIEWPORT_PREVIEW_START_SUCCESS = "VIEWPORT_PREVIEW_START_SUCCESS";
export const viewportPreviewStartSuccess = () => ({
    type: VIEWPORT_PREVIEW_START_SUCCESS
});

export const VIEWPORT_PREVIEW_STOP_REQUEST = "VIEWPORT_PREVIEW_STOP_REQUEST";
export const viewportPreviewStopRequest = () => ({
    type: VIEWPORT_PREVIEW_STOP_REQUEST
});

export const VIEWPORT_PREVIEW_STOP_ERROR = "VIEWPORT_PREVIEW_STOP_ERROR";
export const viewportPreviewStopError = (error) => ({
    type: VIEWPORT_PREVIEW_STOP_ERROR,
    error
});

export const VIEWPORT_PREVIEW_STOP_SUCCESS = "VIEWPORT_PREVIEW_STOP_SUCCESS";
export const viewportPreviewStopSuccess = () => ({
    type: VIEWPORT_PREVIEW_STOP_SUCCESS
});

/* Viewport thunks */
export const viewportGetCurrentPicture = () => (dispatch) => {
    dispatch(viewportGetCurrentPictureRequest());
    return(fetchAwesomO({ url: '/api/camera/current' })
        .then(  response => response.json(), 
                error => dispatch(viewportGetCurrentPictureError(error)))
        .then( current => {
            if( current !== undefined ) {
                dispatch(viewportGetCurrentPictureSuccess(current.src));
            } else {
                dispatch(viewportGetCurrentPictureSuccess(undefined));
            }
         })
    );
}

export const viewportGetPreviewEnabled = () => (dispatch) => {
    dispatch(viewportGetPreviewEnabledRequest());
    return(fetchAwesomO({ url: '/api/camera/preview/0' }) //Assume only one camera for now -- and index 0
        .then(  response => response.json(), 
                error => dispatch(viewportGetPreviewEnabledError(error)))
        .then( preview => dispatch(viewportGetPreviewEnabledSuccess(preview.enabled))));
};

export const viewportPreviewStart = () => (dispatch) => {
    dispatch(viewportPreviewStartRequest());
    return(fetchAwesomO({ url: '/api/camera/preview/start/0', //Assume only one camera for now -- and index 0
                          method: 'PUT' })
        .then(  response => dispatch(viewportPreviewStartSuccess()),
                error => dispatch(viewportPreviewStartError(error)) ));
};

export const viewportPreviewStop = () => (dispatch) => {
    dispatch(viewportPreviewStopRequest());
    return(fetchAwesomO({ url: '/api/camera/stop/0', //Assume only one camera for now -- and index 0
                          method: 'PUT' })
        .then(  response => dispatch(viewportPreviewStopSuccess()),
                error => dispatch(viewportPreviewStopError(error))));
};

/* Controller actions */
export const CONTROLLER_RUNNING_STATUS_RUNNING = 'CONTROLLER_RUNNING_STATUS_RUNNING';
export const CONTROLLER_RUNNING_STATUS_PAUSED = 'CONTROLLER_RUNNING_STATUS_PAUSED';
export const CONTROLLER_RUNNING_STATUS_STOPPED = 'CONTROLLER_RUNNING_STATUS_STOPPED';

//Controller state: Things like running, paused, stopped, and current location of camera arm (row, col)
export const CONTROLLER_SET_RUNNING_STATUS = "CONTROLLER_SET_RUNNING_STATUS";
export const controllerSetRunningStatus = (status,userId) => ({
    type: CONTROLLER_SET_RUNNING_STATUS,
    status,
    userId
});

export const CONTROLLER_SET_LOCATION = "CONTROLLER_SET_LOCATION";
export const controllerSetLocation = (location) => ({
    type: CONTROLLER_SET_LOCATION,
    location: location
});

export const CONTROLLER_MOVE_PLATE_REQUEST = "CONTROLLER_MOVE_PLATE_REQUEST";
export const controllerMovePlateRequest = () => ({
    type: CONTROLLER_MOVE_PLATE_REQUEST
});

export const CONTROLLER_MOVE_PLATE_ERROR = "CONTROLLER_MOVE_PLATE_ERROR";
export const controllerMovePlateError = (error) => ({
    type: CONTROLLER_MOVE_PLATE_ERROR,
    error
});

export const CONTROLLER_MOVE_PLATE_SUCCESS = "CONTROLLER_MOVE_PLATE_SUCCESS";
export const controllerMovePlateSuccess = (location) => ({
    type: CONTROLLER_MOVE_PLATE_SUCCESS,
    location
});

export const CONTROLLER_MOVE_DISTANCE_REQUEST = "CONTROLLER_MOVE_DISTANCE_REQUEST";
export const controllerMoveDistanceRequest = () => ({
    type: CONTROLLER_MOVE_DISTANCE_REQUEST,
});

export const CONTROLLER_MOVE_DISTANCE_ERROR = "CONTROLLER_MOVE_DISTANCE_ERROR";
export const controllerMoveDistanceError = (error) => ({
    type: CONTROLLER_MOVE_DISTANCE_ERROR,
    error
});

export const CONTROLLER_MOVE_DISTANCE_SUCCESS = "CONTROLLER_MOVE_DISTANCE_SUCCESS";
export const controllerMoveDistanceSuccess = (location) => ({
    type: CONTROLLER_MOVE_DISTANCE_SUCCESS,
    location
});

export const CONTROLLER_MOVE_HOME_REQUEST = "CONTROLLER_MOVE_HOME_REQUEST";
export const controllerMoveHomeRequest = () => ({
    type: CONTROLLER_MOVE_HOME_REQUEST
});

export const CONTROLLER_MOVE_HOME_ERROR = "CONTROLLER_MOVE_HOME_ERROR";
export const controllerMoveHomeError = (error) => ({
    type: CONTROLLER_MOVE_HOME_ERROR,
    error
});

export const CONTROLLER_MOVE_HOME_SUCCESS = "CONTROLLER_MOVE_HOME_SUCCESS";
export const controllerMoveHomeSuccess = (location) => ({
    type: CONTROLLER_MOVE_HOME_SUCCESS,
    location
});

export const CONTROLLER_SET_USER_REQUEST = "CONTROLLER_SET_USER_REQUEST";
export const controllerSetUserRequest = () => ({
    type: CONTROLLER_SET_USER_REQUEST
});

export const CONTROLLER_SET_USER_ERROR = "CONTROLLER_SET_USER_ERROR";
export const controllerSetUserError = (error) => ({
    type: CONTROLLER_SET_USER_ERROR,
    error
});

export const CONTROLLER_SET_USER_SUCCESS = "CONTROLLER_SET_USER_SUCCESS";
export const controllerSetUserSuccess = (userId) => ({
    type: CONTROLLER_SET_USER_SUCCESS,
    userId
});

export const CONTROLLER_CLEAR_USER_REQUEST = "CONTROLLER_CLEAR_USER_REQUEST";
export const controllerClearUserRequest = () => ({
    type: CONTROLLER_CLEAR_USER_REQUEST
});

export const CONTROLLER_CLEAR_USER_ERROR = "CONTROLLER_CLEAR_USER_ERROR";
export const controllerClearUserError = (error) => ({
    type: CONTROLLER_CLEAR_USER_ERROR,
    error
});

export const CONTROLLER_CLEAR_USER_SUCCESS = "CONTROLLER_CLEAR_USER_SUCCESS";
export const controllerClearUserSuccess = () => ({
    type: CONTROLLER_CLEAR_USER_SUCCESS
});

export const CONTROLLER_SET_PROJECT_REQUEST = "CONTROLLER_SET_PROJECT_REQUEST";
export const controllerSetProjectRequest = () => ({
    type: CONTROLLER_SET_PROJECT_REQUEST
});

export const CONTROLLER_SET_PROJECT_ERROR = "CONTROLLER_SET_PROJECT_ERROR";
export const controllerSetProjectError = (error) => ({
    type: CONTROLLER_SET_PROJECT_ERROR,
    error
});

export const CONTROLLER_SET_PROJECT_SUCCESS = "CONTROLLER_SET_PROJECT_SUCCESS";
export const controllerSetProjectSuccess = (projectId) => ({
    type: CONTROLLER_SET_PROJECT_SUCCESS,
    projectId
});

export const CONTROLLER_CLEAR_PROJECT_REQUEST = "CONTROLLER_CLEAR_PROJECT_REQUEST";
export const controllerClearProjectRequest = () => ({
    type: CONTROLLER_CLEAR_PROJECT_REQUEST
});

export const CONTROLLER_CLEAR_PROJECT_ERROR = "CONTROLLER_CLEAR_PROJECT_ERROR";
export const controllerClearProjectError = (error) => ({
    type: CONTROLLER_CLEAR_PROJECT_ERROR,
    error
});

export const CONTROLLER_CLEAR_PROJECT_SUCCESS = "CONTROLLER_CLEAR_PROJECT_SUCCESS";
export const controllerClearProjectSuccess = () => ({
    type: CONTROLLER_CLEAR_PROJECT_SUCCESS
});

export const CONTROLLER_START_REQUEST = "CONTROLLER_START_REQUEST";
export const controllerStartRequest = () => ({
    type: CONTROLLER_START_REQUEST
});

export const CONTROLLER_START_ERROR = "CONTROLLER_START_ERROR";
export const controllerStartError = (error) => ({
    type: CONTROLLER_START_ERROR,
    error
});

export const CONTROLLER_START_SUCCESS = "CONTROLLER_START_SUCCESS";
export const controllerStartSuccess = () => ({
    type: CONTROLLER_START_SUCCESS
});

export const CONTROLLER_RESUME_REQUEST = "CONTROLLER_RESUME_REQUEST";
export const controllerResumeRequest = () => ({
    type: CONTROLLER_RESUME_REQUEST
});

export const CONTROLLER_RESUME_ERROR = "CONTROLLER_RESUME_ERROR";
export const controllerResumeError = (error) => ({
    type: CONTROLLER_RESUME_ERROR,
    error
});

export const CONTROLLER_RESUME_SUCCESS = "CONTROLLER_RESUME_SUCCESS";
export const controllerResumeSuccess = () => ({
    type: CONTROLLER_RESUME_SUCCESS
});

export const CONTROLLER_PAUSE_REQUEST = "CONTROLLER_PAUSE_REQUEST";
export const controllerPauseRequest = () => ({
    type: CONTROLLER_PAUSE_REQUEST
});

export const CONTROLLER_PAUSE_ERROR = "CONTROLLER_PAUSE_ERROR";
export const controllerPauseError = (error) => ({
    type: CONTROLLER_PAUSE_ERROR,
    error
});

export const CONTROLLER_PAUSE_SUCCESS = "CONTROLLER_PAUSE_SUCCESS";
export const controllerPauseSuccess = () => ({
    type: CONTROLLER_PAUSE_SUCCESS
});

export const CONTROLLER_STOP_REQUEST = "CONTROLLER_STOP_REQUEST";
export const controllerStopRequest = () => ({
    type: CONTROLLER_STOP_REQUEST
});

export const CONTROLLER_STOP_ERROR = "CONTROLLER_STOP_ERROR";
export const controllerStopError = (error) => ({
    type: CONTROLLER_STOP_ERROR,
    error
});

export const CONTROLLER_STOP_SUCCESS = "CONTROLLER_STOP_SUCCESS";
export const controllerStopSuccess = () => ({
    type: CONTROLLER_STOP_SUCCESS
});

export const CONTROLLER_GET_CURRENT_STATUS_REQUEST = "CONTROLLER_GET_CURRENT_STATUS_REQUEST";
export const controllerGetCurrentStatusRequest = () => ({
    type: CONTROLLER_GET_CURRENT_STATUS_REQUEST
});

export const CONTROLLER_GET_CURRENT_STATUS_ERROR = "CONTROLLER_GET_CURRENT_STATUS_ERROR";
export const controllerGetCurrentStatusError = (error) => ({
    type: CONTROLLER_GET_CURRENT_STATUS_ERROR,
    error
});

export const CONTROLLER_GET_CURRENT_STATUS_SUCCESS = "CONTROLLER_GET_CURRENT_STATUS_SUCCESS";
export const controllerGetCurrentStatusSuccess = (status, userId, projectId, location) => ({
    type: CONTROLLER_GET_CURRENT_STATUS_SUCCESS,
    status,
    userId,
    projectId,
    location
});


export const controllerMovePlate = (direction, numPlates) => dispatch => {
    dispatch(controllerMovePlateRequest());
    return(fetchAwesomO({
        url: '/api/controller/move/'+direction+'/plates/'+numPlates,
        method: 'PUT'})
        .then(  response => response.json(),
                error => dispatch(controllerMovePlateError(error)) )
        .then(location => dispatch(controllerMovePlateSuccess(location))));
}

export const controllerMoveDistance = (direction, distance) => dispatch => {
    dispatch(controllerMoveDistanceRequest());
    return(fetchAwesomO({
        url: '/api/controller/move/'+direction+'/cm/'+distance,
        method: 'PUT'})
        .then(  response => response.json(),
                error => dispatch(controllerMoveDistanceError(error)) )
        .then(location => dispatch(controllerMoveDistanceSuccess(location))));
}

export const controllerMoveHome = (moveX, moveY) => dispatch => {
    let promise = undefined;
    dispatch(controllerMoveHomeRequest());
    if( moveX && moveY ) {
        promise = fetchAwesomO({ url: '/api/controller/home',
                                 method: 'PUT' });
    } else if( moveX ) {
        promise = fetchAwesomO({ url: '/api/controller/homex',
                                 method: 'PUT' });
    } else if( moveY ) {
        promise = fetchAwesomO({ url: '/api/controller/homex',
                                 method: 'PUT' });
    }

    if( promise ) {
        return(promise
                .then(  response => response.json(),
                        error => dispatch(controllerMoveHomeError(error)))
                .then( location => dispatch(controllerMoveHomeSuccess(location))));
    }
}

export const controllerSetUser = (userId) => dispatch => {
    dispatch(controllerSetUserRequest());
    return(fetchAwesomO({ url: '/api/controller/user/set/' + userId,  method: 'PUT' })
        .then(  response => response.json(),
                error => dispatch(controllerSetUserError(error)))
        .then( json => dispatch(controllerSetUserSuccess(json.userId))));
}

export const controllerClearUser = (userId) => dispatch => {
    dispatch(controllerClearUserRequest());
    return(fetchAwesomO({ url: '/api/controller/user/clear/' + userId,  method: 'PUT' })
        .then(  response => dispatch(controllerClearUserSuccess()), 
                error => dispatch(controllerClearUserError(error))));
}

export const controllerSetProject = (projectId) => dispatch => {
    dispatch(controllerSetProjectRequest());
    return(fetchAwesomO({ url: '/api/controller/project/set/' + projectId,  method: 'PUT' })
        .then(  response => response.json(), 
                error => dispatch(controllerSetProjectError(error)))
        .then( json => dispatch(controllerSetProjectSuccess(json.projectId))));
}

export const controllerClearProject = (projectId) => dispatch => {
    dispatch(controllerClearProjectRequest());
    return(fetchAwesomO({ url: '/api/controller/project/clear/' + projectId,  method: 'PUT' })
        .then(  response => dispatch(controllerClearProjectSuccess()), 
                error => dispatch(controllerClearProjectError(error))));
}

export const controllerStart = (userId,projectId) => dispatch => {
    dispatch(controllerStartRequest());
    return(fetchAwesomO({ url: '/api/controller/start/'+userId+'/'+projectId, method: 'PUT' })
        .then(  response => dispatch(controllerStartSuccess()), 
                error => dispatch(controllerStartError(error))));
}

export const controllerResume = () => dispatch => {
    dispatch(controllerResumeRequest());
    return(fetchAwesomO({ url: '/api/controller/resume', method: 'PUT' })
        .then(  response => dispatch(controllerResumeSuccess()),
                error => dispatch(controllerResumeError(error))));
}

export const controllerPause = () => dispatch => {
    dispatch(controllerPauseRequest());
    return(fetchAwesomO({ url: '/api/controller/pause', method: 'PUT' })
        .then(  response => dispatch(controllerPauseSuccess()), 
                error => dispatch(controllerPauseError(error))));
}

export const controllerStop = () => dispatch => {
    dispatch(controllerStopRequest());
    return(fetchAwesomO({ url: '/api/controller/stop', method: 'PUT' })
        .then(  response => dispatch(controllerStopSuccess()), 
                error => dispatch(controllerStopError(error))));
}

export const controllerGetCurrentStatus = () => dispatch => {
    dispatch(controllerGetCurrentStatusRequest());
    return(fetchAwesomO({ url: '/api/controller/current' })
        .then(  response => response.json(), 
                error => dispatch(controllerGetCurrentStatusError(error)))
        .then( current => dispatch(controllerGetCurrentStatusSuccess(current.status, current.userId, current.projectId, current.location))));
}
