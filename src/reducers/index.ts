import userReducer from './user';
import searchQueryReducer from './searchQuery';
import movieInfoReducer from './movieInfo';
import posterPositionReducer from './posterPosition';
import isLoadingReducer from './isLoading';
import isRatingUpdatedReducer from './isRatingUpdated';
import regionCodeReducer from './regionCode';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  user: userReducer,
  searchQuery: searchQueryReducer,
  movieInfo: movieInfoReducer,
  posterPosition: posterPositionReducer,
  isLoading: isLoadingReducer,
  isRatingUpdated: isRatingUpdatedReducer,
  regionCode: regionCodeReducer,
});

export default rootReducer;
