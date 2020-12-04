import firebase from 'firebase/app';

interface LoginAction {
    type: string,
    payload: firebase.User
}

const userReducer = (state = {}, action: LoginAction) => {
    switch(action.type) {
        case 'LOGIN':
            return action.payload;
        default:
            return state;
    }
}

export default userReducer;