import {
  Add,
  CalendarToday,
  Grade,
  MovieFilter,
  Schedule,
} from '@material-ui/icons';
import React from 'react';
import { useSelector } from 'react-redux';

interface RootState {
  movieInfo: OMDbMovie;
}

function MoviePage() {
  const movieInfo = useSelector((state: RootState) => state.movieInfo);

  return (
    <div className='movie-page-wrapper'>
      <div className='movie-page-header'>
        <h1>{movieInfo.Title}</h1>
        <div className='movie-page-icon-action'>
          <Add />
        </div>
      </div>
      <div className='movie-page-info'>
        <div className='movie-page-info-poster'>
          <img src={movieInfo.Poster} alt={movieInfo.Title} />
        </div>
        <div className='movie-page-info-extra'>
          <p>
            <div className='movie-page-icon'>
              <MovieFilter />
            </div>
            {movieInfo.Genre}
          </p>
          <div className='movie-page-stats'>
            <p>
              <div className='movie-page-icon'>
                <Schedule />
              </div>
              {movieInfo.Runtime}
            </p>
            {parseInt(movieInfo.imdbVotes) > 0 ? (
              <p>
                <div className='movie-page-icon'>
                  <Grade />
                </div>
                {movieInfo.imdbRating} ({movieInfo.imdbVotes})
              </p>
            ) : (
              <p>
                <div className='movie-page-icon'>
                  <Grade />
                </div>
                N/A (N/A)
              </p>
            )}
            <p>
              <div className='movie-page-icon'>
                <CalendarToday />
              </div>
              {movieInfo.Released}
            </p>
          </div>
          <p>{movieInfo.Plot}</p>
        </div>
      </div>
    </div>
  );
}

export default MoviePage;
