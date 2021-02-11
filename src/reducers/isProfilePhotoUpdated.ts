interface ProfilePhotoUpdateAction {
  type: string;
}

const isProfilePhotoUpdatedReducer = (
  state = false,
  action: ProfilePhotoUpdateAction
) => {
  switch (action.type) {
    case 'UPDATE_PROFILE_PHOTO':
      return !state;
    default:
      return state;
  }
};

export default isProfilePhotoUpdatedReducer;
