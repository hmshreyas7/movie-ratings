interface InfoAction {
    type: string,
    payload: OMDbMovie
}

const movieInfoReducer = (state = {}, action: InfoAction) => {
    switch(action.type) {
        case 'VIEW_MOVIE_DETAILS':
            return action.payload;
        default:
            return state;
    }
}

export default movieInfoReducer;