interface ActionConfirmationToggleAction {
  type: string;
  payload: ActionConfirmation;
}

const actionConfirmationReducer = (
  state = {},
  action: ActionConfirmationToggleAction
) => {
  switch (action.type) {
    case 'TOGGLE_ACTION_CONFIRMATION':
      return action.payload;
    default:
      return state;
  }
};

export default actionConfirmationReducer;
