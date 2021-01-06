import { Grade } from '@material-ui/icons';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { viewMovieDetails } from '../actions';
import { RootState } from '../rootState';
import RatingDialog from './RatingDialog';

interface MovieCardProps {
  movieInfo: OMDbMovie | MovieRatingInfo;
}

function MovieCard(props: MovieCardProps) {
  let history = useHistory();
  let dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  let [isDialogOpen, setDialogOpen] = useState(false);
  const { movieInfo } = props;

  const { id, poster, title, rating } =
    'imdbID' in movieInfo
      ? {
          id: movieInfo.imdbID,
          poster: movieInfo.Poster,
          title: movieInfo.Title,
          rating: movieInfo.imdbRating,
        }
      : movieInfo;

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAdd = () => {
    if (user.uid) {
      setDialogOpen(true);
    } else {
      history.push('/login');
    }
  };

  const handleView = () => {
    if ('imdbID' in movieInfo) {
      history.push(`/movie/${id}`);
      dispatch(viewMovieDetails(movieInfo));
    }
  };

  return (
    <div className='movie-card-wrapper'>
      <div className='movie-card-poster'>
        <img src={poster} alt={title} />
        {'imdbID' in movieInfo && (
          <div className='movie-card-overlay'>
            <RatingDialog
              isOpen={isDialogOpen}
              onClose={handleDialogClose}
              movieInfo={movieInfo}
            />
            <button onClick={handleAdd}>Add</button>
            <button onClick={handleView}>View</button>
          </div>
        )}
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
