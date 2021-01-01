import firebase from 'firebase/app';

export const login = (user: firebase.User) => {
  return {
    type: 'LOGIN',
    payload: user,
  };
};

export const logout = () => {
  return {
    type: 'LOGOUT',
  };
};

export const search = (query: string) => {
  return {
    type: 'SEARCH',
    payload: query,
  };
};

export const viewMovieDetails = (movie: OMDbMovie) => {
  return {
    type: 'VIEW_MOVIE_DETAILS',
    payload: movie,
  };
};

export const loading = (isLoading: boolean) => {
  return {
    type: 'LOADING',
    payload: isLoading,
  };
};
