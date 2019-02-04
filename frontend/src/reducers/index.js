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

import controller, * as fromController from './controller';
import cameraConfiguration, * as fromCameraConfiguration from './cameraConfiguration';
import viewport, * as fromViewport from './viewport';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    controller,
    viewport,
    cameraConfiguration,
});

export default rootReducer;

export const getControllerStatus = (state) => fromController.getControllerStatus(state.controller);
export const getControllerLocation = (state) => fromController.getControllerLocation(state.controller);
export const getViewportImage = (state) => fromViewport.getViewportImage(state.viewport);
export const getCameraConfigurationEntries = (state) => fromCameraConfiguration.getCameraConfigurationEntries(state.cameraConfiguration);
