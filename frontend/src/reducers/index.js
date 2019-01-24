import cameraConfiguration, * as fromCameraConfiguration from './cameraConfiguration'
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    cameraConfiguration,
});

export default rootReducer;

export const getCameraConfigurationEntries = (state) => fromCameraConfiguration.getCameraConfigurationEntries(state.cameraConfiguration);
