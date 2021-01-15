interface SetRegionAction {
  type: string;
  payload: string;
}

const regionCodeReducer = (state = '', action: SetRegionAction) => {
  switch (action.type) {
    case 'SET_REGION':
      return action.payload;
    default:
      return state;
  }
};

export default regionCodeReducer;
