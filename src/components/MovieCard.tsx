import { Grade } from '@material-ui/icons';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setMoviePosterPosition, viewMovieDetails } from '../actions';
import { RootState } from '../rootState';
import RatingDialog from './RatingDialog';
import ConfirmationDialog from './ConfirmationDialog';

interface MovieCardProps {
  movieInfo: OMDbMovie | MovieRatingInfo;
}

function MovieCard(props: MovieCardProps) {
  let history = useHistory();
  let dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  let [isRatingDialogOpen, setRatingDialogOpen] = useState(false);
  let [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const posterRef = useRef<HTMLImageElement>(null);
  const { movieInfo } = props;

  const { id, poster, title, rating, timestamp } =
    'imdbID' in movieInfo
      ? {
          id: movieInfo.imdbID,
          poster: movieInfo.Poster,
          title: movieInfo.Title,
          rating: movieInfo.imdbRating,
          timestamp: null,
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
    if ('imdbID' in movieInfo) {
      history.push(`/movie/${id}`);
      dispatch(viewMovieDetails(movieInfo));

      if (posterRef.current) {
        dispatch(
          setMoviePosterPosition({
            x: posterRef.current.x,
            y: posterRef.current.y,
          })
        );
      }
    }
  };

  const handleDelete = () => {
    setConfirmationDialogOpen(true);
  };

  const getTimestamp = () => {
    if (timestamp) {
      const customTimestamp = new Date(timestamp).toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
      const [date, year, time] = customTimestamp.split(', ');

      const currentYear = new Date().getFullYear().toString();
      let formattedTimestamp = date;
      formattedTimestamp += year === currentYear ? '' : `, ${year}`;
      formattedTimestamp += ` - ${time}`;

      return formattedTimestamp;
    } else {
      return null;
    }
  };

  return (
    <div className='movie-card-wrapper'>
      {timestamp && (
        <div className='movie-card-timestamp'>{getTimestamp()}</div>
      )}
      <div className='movie-card-poster'>
        <img src={poster} alt={title} ref={posterRef} />
        <div className='movie-card-overlay'>
          <RatingDialog
            isOpen={isRatingDialogOpen}
            onClose={handleRatingDialogClose}
            movieInfo={movieInfo}
          />
          {!('imdbID' in movieInfo) && (
            <ConfirmationDialog
              isOpen={isConfirmationDialogOpen}
              onClose={handleConfirmationDialogClose}
              movieInfo={movieInfo}
            />
          )}
          <button onClick={handleRate}>
            {'imdbID' in movieInfo ? 'Add' : 'Edit'}
          </button>
          {'imdbID' in movieInfo ? (
            <button onClick={handleView}>View</button>
          ) : (
            <button onClick={handleDelete}>Delete</button>
          )}
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
