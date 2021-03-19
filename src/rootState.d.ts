import firebase from 'firebase/app';

type RootState = Readonly<{
  user: firebase.User;
  isProfilePhotoUpdated: boolean;
  searchQuery: string;
  movieInfo: OMDbMovie | MovieRatingInfo;
  posterPosition: Position;
  isLoading: boolean;
  isRatingUpdated: boolean;
  regionCode: string;
  isWatchNextToggled: boolean;
  actionConfirmation: ActionConfirmation;
}>;
