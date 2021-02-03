import firebase from 'firebase/app';

type RootState = Readonly<{
  user: firebase.User;
  searchQuery: string;
  movieInfo: OMDbMovie;
  posterPosition: Position;
  isLoading: boolean;
  isRatingUpdated: boolean;
  regionCode: string;
}>;
