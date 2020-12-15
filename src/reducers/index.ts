import userReducer from './user';
import searchQueryReducer from './searchQuery';
import movieInfoReducer from './movieInfo';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    user: userReducer,
    searchQuery: searchQueryReducer,
    movieInfo: movieInfoReducer
})

export default rootReducer;