interface RatingUpdateAction {
  type: string;
  payload: boolean;
}

const isRatingUpdatedReducer = (state = false, action: RatingUpdateAction) => {
  switch (action.type) {
    case 'UPDATE_RATING':
      return action.payload;
    default:
      return state;
  }
};

export default isRatingUpdatedReducer;
