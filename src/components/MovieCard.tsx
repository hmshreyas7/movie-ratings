import { Check, Grade, Visibility } from '@material-ui/icons';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  setMoviePosterPosition,
  toggleWatchNext,
  viewMovieDetails,
} from '../actions';
import { RootState } from '../rootState';
import RatingDialog from './RatingDialog';
import ConfirmationDialog from './ConfirmationDialog';
import axios from 'axios';

interface MovieCardProps {
  movieInfo: OMDbMovie | MovieRatingInfo;
  isMovieGridParent?: boolean;
}

function MovieCard(props: MovieCardProps) {
  let history = useHistory();
  let dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  let [isRatingDialogOpen, setRatingDialogOpen] = useState(false);
  let [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const posterRef = useRef<HTMLImageElement>(null);
  const { movieInfo, isMovieGridParent } = props;

  const { id, poster, title, rating, timestamp } =
    'imdbID' in movieInfo
      ? {
          id: movieInfo.imdbID,
          poster: movieInfo.Poster,
          title: movieInfo.Title,
          rating: movieInfo.imdbRating,
          timestamp: movieInfo.Timestamp,
        }
      : movieInfo;

  const handleRatingDialogClose = () => {
    setRatingDialogOpen(false);
  };

  const handleConfirmationDialogClose = () => {
    setConfirmationDialogOpen(false);
  };

  const handleRate = () => {
    if (user.uid) {
      setRatingDialogOpen(true);
    } else {
      history.push('/login');
    }
  };

  const handleView = () => {
    history.push(`/movie/${id}`);
    dispatch(viewMovieDetails(movieInfo));

    if (posterRef.current) {
      const posterPosition = posterRef.current.getBoundingClientRect();

      dispatch(
        setMoviePosterPosition({
          x: posterPosition.x,
          y: posterPosition.y,
        })
      );
    }
  };

  const handleDelete = () => {
    setConfirmationDialogOpen(true);
  };

  const handleAdd = () => {
    if (user.uid) {
      axios
        .post('/api/watch-next', {
          userID: user.uid,
          movie: movieInfo,
          timestamp: new Date().toString(),
        })
        .then((res) => {
          console.log(res.data);
          dispatch(toggleWatchNext());
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      history.push('/login');
    }
  };

  const handleRemove = () => {
    setConfirmationDialogOpen(true);
  };

  const getTimestamp = () => {
    if (timestamp) {
      const timestampDate = new Date(timestamp);
      const currentDate = new Date();

      const timestampYear = timestampDate.getFullYear();
      const currentYear = currentDate.getFullYear();

      const formattedDate = timestampDate.toLocaleDateString('en-US', {
        year: timestampYear !== currentYear ? 'numeric' : undefined,
        month: 'short',
        day: 'numeric',
      });
      const formattedTime = timestampDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      return `${formattedDate} - ${formattedTime}`;
    } else {
      return null;
    }
  };

  return (
    <div className='movie-card-wrapper'>
      {timestamp && (
        <div className='movie-card-timestamp' title='Added on'>
          {getTimestamp()}
        </div>
      )}
      <div className='movie-card-poster'>
        <img src={poster} alt={title} ref={posterRef} />
        {isMovieGridParent && timestamp && (
          <div
            className='movie-card-type-indicator'
            style={
              'imdbID' in movieInfo
                ? { background: '#019ec9' }
                : { background: '#6bb86a' }
            }
          >
            {'imdbID' in movieInfo ? <Visibility /> : <Check />}
          </div>
        )}
        <div className='movie-card-overlay'>
          <RatingDialog
            isOpen={isRatingDialogOpen}
            onClose={handleRatingDialogClose}
            movieInfo={movieInfo}
          />
          {timestamp && (
            <ConfirmationDialog
              isOpen={isConfirmationDialogOpen}
              onClose={handleConfirmationDialogClose}
              movieInfo={movieInfo}
            />
          )}
          <button onClick={handleRate}>
            {'imdbID' in movieInfo ? 'Rate' : 'Edit'}
          </button>
          {!('imdbID' in movieInfo) && (
            <button onClick={handleDelete}>Delete</button>
          )}
          {'imdbID' in movieInfo &&
            (timestamp ? (
              <button onClick={handleRemove}>Remove</button>
            ) : (
              <button onClick={handleAdd}>Add</button>
            ))}
          <button onClick={handleView}>View</button>
        </div>
      </div>
      <div className='movie-card-info'>
        <p>{title}</p>
        <div className='movie-card-rating'>
          <Grade fontSize='small' />
          <p>{rating}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
