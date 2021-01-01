interface LoadingAction {
  type: string;
  payload: boolean;
}

const isLoadingReducer = (state = true, action: LoadingAction) => {
  switch (action.type) {
    case 'LOADING':
      return action.payload;
    default:
      return state;
  }
};

export default isLoadingReducer;
