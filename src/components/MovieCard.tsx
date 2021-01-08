import { Grade } from '@material-ui/icons';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateRating, viewMovieDetails } from '../actions';
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

  const handleRate = () => {
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

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/delete-rating/${user.uid}/${id}`)
      .then((res) => {
        console.log(res.data);
        dispatch(updateRating(true));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='movie-card-wrapper'>
      <div className='movie-card-poster'>
        <img src={poster} alt={title} />
        <div className='movie-card-overlay'>
          <RatingDialog
            isOpen={isDialogOpen}
            onClose={handleDialogClose}
            movieInfo={movieInfo}
          />
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
