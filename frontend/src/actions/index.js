/* Define our action creators here */

//Projects-level action creators
export const receiveProjects = (response) => ({
    type: 'RECEIVE_PROJECTS',
    response,
});

//Project-level action creators
//NOTE: I do not explicitly set project table cross-references to camera configuration, etc., as the global store
// does not keep track of more than one camera configuration, experimental configuration, etc.
export const receiveProject = (response) => ({
    type: 'RECEIVE_PROJECT',
    response
});

export const setProjectVersion = (version) => ({
    type: "SET_PROJECT_VERSION",
    version,
});
export const setProjectDescription = (description) => ({
    type: "SET_PROJECT_DESCRIPTION",
    description,
});

export const setProjectImagePath = (imagePath) => ({
    type: "SET_PROJECT_IMAGE_PATH",
    imagePath,
});

//Camera-configuration action-creators

export const receiveCameraConfiguration = (response) => ({
    type: "RECEIVE_CAMERA_CONFIGURATION",
    config: response,
});

export const setCameraEntryValue = (id, value) => ({
    type: "SET_CAMERA_ENTRY_VALUE",
    id,
    value,
});
export const resetCameraConfigurationChangeFlag = (id) => ({
    type: "RESET_CAMERA_CONFIGURATION_CHANGE_FLAG",
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
