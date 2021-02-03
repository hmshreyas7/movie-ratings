interface PositionAction {
  type: string;
  payload: Position;
}

const posterPositionReducer = (state = {}, action: PositionAction) => {
  switch (action.type) {
    case 'SET_MOVIE_POSTER_POSITION':
      return action.payload;
    default:
      return state;
  }
};

export default posterPositionReducer;
