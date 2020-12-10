import firebase from 'firebase/app';

export const login = (user: firebase.User) => {
    return {
        type: 'LOGIN',
        payload: user
    }
}

export const search = (query: string) => {
    return {
        type: 'SEARCH',
        payload: query
    }
}