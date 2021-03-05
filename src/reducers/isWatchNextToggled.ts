interface WatchNextToggleAction {
  type: string;
}

const isWatchNextToggledReducer = (
  state = false,
  action: WatchNextToggleAction
) => {
  switch (action.type) {
    case 'TOGGLE_WATCH_NEXT':
      return !state;
    default:
      return state;
  }
};

export default isWatchNextToggledReducer;
