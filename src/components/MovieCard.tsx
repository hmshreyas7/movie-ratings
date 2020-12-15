import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { viewMovieDetails } from '../actions';

interface MovieCardProps {
  movieInfo: OMDbMovie;
}

function MovieCard(props: MovieCardProps) {
  let history = useHistory();
  let dispatch = useDispatch();

  const handleClick = () => {
    history.push(`/movie/${props.movieInfo.imdbID}`);
    dispatch(viewMovieDetails(props.movieInfo));
  };

  return (
    <div className='movie-card-wrapper'>
      <div className='movie-card-poster'>
        <img src={props.movieInfo.Poster} alt={props.movieInfo.Title} />
        <div className='movie-card-overlay'>
          <button>Add</button>
          <button onClick={handleClick}>View</button>
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
