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
