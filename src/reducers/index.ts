import userReducer from './user';
import isProfilePhotoUpdatedReducer from './isProfilePhotoUpdated';
import searchQueryReducer from './searchQuery';
import movieInfoReducer from './movieInfo';
import posterPositionReducer from './posterPosition';
import isLoadingReducer from './isLoading';
import isRatingUpdatedReducer from './isRatingUpdated';
import regionCodeReducer from './regionCode';
import isWatchNextToggledReducer from './isWatchNextToggled';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  user: userReducer,
  isProfilePhotoUpdated: isProfilePhotoUpdatedReducer,
  searchQuery: searchQueryReducer,
  movieInfo: movieInfoReducer,
  posterPosition: posterPositionReducer,
  isLoading: isLoadingReducer,
  isRatingUpdated: isRatingUpdatedReducer,
  regionCode: regionCodeReducer,
  isWatchNextToggled: isWatchNextToggledReducer,
});

export default rootReducer;
