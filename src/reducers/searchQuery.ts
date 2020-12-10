interface SearchAction {
    type: string,
    payload: string
}

const searchQueryReducer = (state = '', action: SearchAction) => {
    switch(action.type) {
        case 'SEARCH':
            return action.payload;
        default:
            return state;
    }
}

export default searchQueryReducer;