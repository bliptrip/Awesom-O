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
