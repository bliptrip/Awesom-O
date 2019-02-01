const viewport = (state = {}, action) => {
    let newState = {}
    switch( action.type ) {
        case "RECEIVE_CURRENT_PICTURE":
            newState.src = action.src;
            return newState;
        default:
            return state;
    }
}

export default viewport;

export const getViewportImage = state => {
    return state.src;
}
