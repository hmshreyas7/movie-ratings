import userReducer from './user';
import searchQueryReducer from './searchQuery';
import movieInfoReducer from './movieInfo';
import isLoadingReducer from './isLoading';
import isRatingUpdatedReducer from './isRatingUpdated';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  user: userReducer,
  searchQuery: searchQueryReducer,
  movieInfo: movieInfoReducer,
  isLoading: isLoadingReducer,
  isRatingUpdated: isRatingUpdatedReducer,
});

export default rootReducer;
