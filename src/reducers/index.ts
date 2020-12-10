import userReducer from './user';
import searchQueryReducer from './searchQuery';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    user: userReducer,
    searchQuery: searchQueryReducer
})

export default rootReducer;