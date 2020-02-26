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
export const userChangePasswordSuccess = (open) => ({
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
export const projectSaveRequest = (project) => ({
    type: PROJECT_SAVE_REQUEST,
    project
});

export const PROJECT_SAVE_ERROR = 'PROJECT_SAVE_ERROR';
export const projectSaveError = (error) => ({
    type: PROJECT_SAVE_ERROR,
    error
});

export const PROJECT_SAVE_SUCCESS = 'PROJECT_SAVE_SUCCESS';
export const projectSaveSuccess= (id) => ({
    type: PROJECT_SAVE_SUCCESS,
    id
});

export const PROJECT_SET_SHORT = "PROJECT_SET_SHORT";
export const projectSetShort = (id, description) => ({
    type: PROJECT_SET_DESCRIPTION,
    id, //Project ID
    short: description 
});

export const PROJECT_SET_DESCRIPTION = "PROJECT_SET_DESCRIPTION";
export const projectSetDescription = (id, description) => ({
    type: PROJECT_SET_DESCRIPTION,
    id, //Project ID
    description
});

export const PROJECT_SET_CAMERA_CONFIG = "PROJECT_SET_CAMERA_CONFIG";
export const projectSetCameraConfig= (id, cameraId) => ({
    type: PROJECT_SET_CAMERA_CONFIG,
    id, //Project ID
    cameraId
});

export const PROJECT_SET_EXPERIMENT_CONFIG = "PROJECT_SET_EXPERIMENT_CONFIG";
export const projectSetExperimentConfig = (id, experimentId) => ({
    type: PROJECT_SET_EXPERIMENT_CONFIG,
    id, //Project ID
    experimentId
});

export const PROJECT_ADD_STORAGE_CONFIG = "PROJECT_ADD_STORAGE_CONFIG";
export const projectAddStorageConfig = (id, storageId) => ({
    type: PROJECT_ADD_STORAGE_CONFIG,
    id, //Project ID
    storageId
});

export const PROJECT_REMOVE_STORAGE_CONFIG = "PROJECT_REMOVE_STORAGE_CONFIG";
export const projectRemoveStorageConfig = (id, storageId) => ({
    type: PROJECT_REMOVE_STORAGE_CONFIG,
    id, //Project ID
    storageId
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
    routeId
});

export const PROJECT_SET_EDITOR_OPEN = "PROJECT_SET_EDITOR_OPEN";
export const projectSetEditorOpen = (open) => ({
    type: PROJECT_SET_EDITOR_OPEN,
    isEditorOpen: open
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
    .then(project =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(projectCreateSuccess(project))
    ));
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
    .then(project =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(projectFetchSuccess(project))
    ));
};

export const projectSave = project => dispatch => {
    dispatch(projectSaveRequest(project));
    return(fetchAwesomO({
        url: '/api/project/save/', 
        method: 'POST', 
        body: project})
    .then(  response => response.json(),
            error => dispatch(projectSaveError(error)) )
    .then(json => dispatch(projectSaveSuccess(json._id))));
    
}

//Camera-configuration action-creators
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
export const cameraConfigFetchRequest = (_id) => ({
    type: CAMERA_CONFIG_FETCH_REQUEST,
    _id,
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
export const cameraConfigSetShort = (id, description) => ({
    type: CAMERA_CONFIG_SET_SHORT,
    id,
    short: description
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

export const CAMERA_CONFIG_SET_EDITOR_OPEN = 'CAMERA_CONFIG_SET_EDITOR_OPEN';
export const cameraConfigSetEditorOpen = (open) => ({
    type: CAMERA_CONFIG_SET_EDITOR_OPEN,
    isEditorOpen: open
});

export const CAMERA_CONFIG_SET_ENTRY_VALUE = 'CAMERA_CONFIG_SET_ENTRY_VALUE';
export const cameraConfigSetEntryValue = (eid,value) => ({
    type: CAMERA_CONFIG_SET_ENTRY_VALUE,
    id: eid,
    value
});

export const CAMERA_CONFIG_RESET_STALE_FLAG = 'CAMERA_CONFIG_RESET_STALE_FLAG';
export const cameraConfigResetStaleFlag = (eid) => ({
    type: CAMERA_CONFIG_RESET_STALE_FLAG,
    id: eid
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

export const cameraConfigSave = (cameraConfig) => dispatch => {
    dispatch(cameraConfigSaveRequest());
    return(fetchAwesomO({
        url: '/api/camera/save',
        method: 'POST',
        body: cameraConfig})
    .then(response => response.json(),
          error => dispatch(cameraConfigSaveError(error)))
    .then( _id => dispatch(cameraConfigSaveSuccess(_id))));
};

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

//Experimental Config
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
    type: EXPERIMENT_CONFIG_SAVE_SUCCESS,
    id,
});

export const EXPERIMENT_CONFIG_SET_EDITOR_OPEN = 'EXPERIMENT_CONFIG_SET_EDITOR_OPEN';
export const experimentConfigSetEditorOpen = (open) => ({
    type: EXPERIMENT_CONFIG_SET_EDITOR_OPEN,
    isEditorOpen: open
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

export const experimentConfigSave = (experimentConfig) => dispatch => {
    dispatch(experimentConfigSaveRequest(experimentConfig._id));
    return(fetchAwesomO({
        url: '/api/experiment/save/', 
        method: 'POST', 
        body: experimentConfig})
    .then(  response => response.json(),
            error => dispatch(experimentConfigSaveError(error)) )
    .then(_id => dispatch(experimentConfigSaveSuccess(experimentConfig._id))));
}

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
    ...storageConfig
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
export const storageConfigSaveRequest = (storageConfig) => ({
    type: STORAGE_CONFIG_SAVE_REQUEST,
    storageConfig
});

export const STORAGE_CONFIG_SAVE_ERROR = 'STORAGE_CONFIG_SAVE_ERROR';
export const storageConfigSaveError = (error) => ({
    type: STORAGE_CONFIG_SAVE_ERROR,
    error
});

export const STORAGE_CONFIG_SAVE_SUCCESS = 'STORAGE_CONFIG_SAVE_SUCCESS';
export const storageConfigSaveSuccess = (id) => ({
    type: STORAGE_CONFIG_SAVE_SUCCESS,
    id
});

export const STORAGE_CONFIG_SET_EDITOR_OPEN = 'STORAGE_CONFIG_SET_EDITOR_OPEN';
export const storageConfigSetEditorOpen = (open) => ({
    type: STORAGE_CONFIG_SET_EDITOR_OPEN,
    isEditorOpen: open 
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

export const storageConfigSave = (storageConfig) => dispatch => {
    dispatch(storageConfigSaveRequest(storageConfig._id));
    return(fetchAwesomO({
        url: '/api/storage/save', 
        method: 'POST', 
        body: storageConfig})
        .then(  response => response.json(),
                error => dispatch(storageConfigSaveError(error)) )
        .then(json => dispatch(storageConfigSaveSuccess(json.id))));
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
        dispatch(storageConfigGetSupportedTypesSuccess(types))
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
export const routeConfigSaveRequest = (routeConfig) => ({
    routeConfig,
    type: ROUTE_CONFIG_SAVE_REQUEST
});

export const ROUTE_CONFIG_SAVE_ERROR = 'ROUTE_CONFIG_SAVE_ERROR';
export const routeConfigSaveError = (error) => ({
    type: ROUTE_CONFIG_SAVE_ERROR,
    error
});

export const ROUTE_CONFIG_SAVE_SUCCESS = 'ROUTE_CONFIG_SAVE_SUCCESS';
export const routeConfigSaveSuccess = (_id) => ({
    _id,
    type: ROUTE_CONFIG_SAVE_SUCCESS
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

export const ROUTE_CONFIG_SET_EDITOR_OPEN = 'ROUTE_CONFIG_SET_EDITOR_OPEN';
export const routeConfigSetEditorOpen = (open) => ({
    type: ROUTE_CONFIG_SET_EDITOR_OPEN,
    isEditorOpen: open
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

export const routeConfigSave = (routeConfig) => dispatch => {
    dispatch(routeConfigSaveRequest());
    return(fetchAwesomO({
        url: '/api/route/save',
        method: 'POST',
        body: routeConfig})
        .then(  response => response.json(),
                error => dispatch(routeConfigSaveError(error)) )
        .then(routeConfig => dispatch(routeConfigSaveSuccess(routeConfig))));
}

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

/* Controller actions */
export const CONTROLLER_RUNNING_STATUS_RUNNING = 'CONTROLLER_RUNNING_STATUS_RUNNING';
export const CONTROLLER_RUNNING_STATUS_PAUSED = 'CONTROLLER_RUNNING_STATUS_PAUSED';
export const CONTROLLER_RUNNING_STATUS_STOPPED = 'CONTROLLER_RUNNING_STATUS_STOPPED';

//Controller state: Things like running, paused, stopped, and current location of camera arm (row, col)
export const CONTROLLER_SET_RUNNING_STATUS = "CONTROLLER_SET_RUNNING_STATUS";
export const controllerSetRunningStatus = (status) => ({
    type: CONTROLLER_SET_RUNNING_STATUS,
    status: status
});

export const CONTROLLER_SET_LOCATION = "CONTROLLER_SET_LOCATION";
export const controllerSetLocation = (location) => ({
    type: CONTROLLER_SET_LOCATION,
    location: location
});

