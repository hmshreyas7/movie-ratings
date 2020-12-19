import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { viewMovieDetails } from '../actions';
import { RootState } from '../rootState';
import RatingDialog from './RatingDialog';

interface MovieCardProps {
  movieInfo: OMDbMovie;
}

function MovieCard(props: MovieCardProps) {
  let history = useHistory();
  let dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  let [isDialogOpen, setDialogOpen] = useState(false);

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
    history.push(`/movie/${props.movieInfo.imdbID}`);
    dispatch(viewMovieDetails(props.movieInfo));
  };

  return (
    <div className='movie-card-wrapper'>
      <div className='movie-card-poster'>
        <img src={props.movieInfo.Poster} alt={props.movieInfo.Title} />
        <div className='movie-card-overlay'>
          <RatingDialog
            isOpen={isDialogOpen}
            onClose={handleDialogClose}
            movieTitle={props.movieInfo.Title}
            movieID={props.movieInfo.imdbID}
          />
          <button onClick={handleAdd}>Add</button>
          <button onClick={handleView}>View</button>
        </div>
      </div>
      <div className='movie-card-info'>
        <p>{props.movieInfo.Title}</p>
        <p>{props.movieInfo.imdbRating}</p>
      </div>
    </div>
  );
}

export default MovieCard;
