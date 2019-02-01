const controller = (state = {}, action) => {
    switch( action.type ) {
        case "RECEIVE_CONTROLLER_STATUS":
            state.status = action.status;
            return state;
        case "RECEIVE_CONTROLLER_LOCATION":
            state.location = action.location;
            return state;
        default:
            return state;
    }
}

export default controller;

export const getControllerStatus = state => (state.status);
export const getControllerLocation = state => (state.location);

