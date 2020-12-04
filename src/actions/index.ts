import firebase from 'firebase/app';

export const login = (user: firebase.User) => {
    return {
        type: 'LOGIN',
        payload: user
    }
}