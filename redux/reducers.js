import { SET_USER } from "./actions";

const initialSate = {
    user: null
}

function userReducer(state = initialSate, action) {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        default:
            return state;
    }
}

export default userReducer;