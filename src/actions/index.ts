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

export const updateProfilePhoto = () => {
  return {
    type: 'UPDATE_PROFILE_PHOTO',
  };
};

export const search = (query: string) => {
  return {
    type: 'SEARCH',
    payload: query,
  };
};

export const viewMovieDetails = (movie: OMDbMovie | MovieRatingInfo) => {
  return {
    type: 'VIEW_MOVIE_DETAILS',
    payload: movie,
  };
};

export const setMoviePosterPosition = (position: Position) => {
  return {
    type: 'SET_MOVIE_POSTER_POSITION',
    payload: position,
  };
};

export const loading = (isLoading: boolean) => {
  return {
    type: 'LOADING',
    payload: isLoading,
  };
};

export const updateRating = (isRatingUpdated: boolean) => {
  return {
    type: 'UPDATE_RATING',
    payload: isRatingUpdated,
  };
};

export const setRegion = (regionCode: string) => {
  return {
    type: 'SET_REGION',
    payload: regionCode,
  };
};

export const toggleWatchNext = () => {
  return {
    type: 'TOGGLE_WATCH_NEXT',
  };
};

export const toggleActionConfirmation = (confirmation: ActionConfirmation) => {
  return {
    type: 'TOGGLE_ACTION_CONFIRMATION',
    payload: confirmation,
  };
};
