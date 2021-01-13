import {
  Add,
  CalendarToday,
  Grade,
  MovieFilter,
  Schedule,
} from '@material-ui/icons';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../rootState';
import NoData from './NoData';
import RatingDialog from './RatingDialog';
import imdbLogo from '../assets/imdb-logo.png';

function MoviePage() {
  const movieInfo = useSelector((state: RootState) => state.movieInfo);
  const user = useSelector((state: RootState) => state.user);

  let history = useHistory();
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

  return (
    <div className='movie-page-wrapper'>
      {movieInfo.imdbID ? (
        <>
          <div className='movie-page-header'>
            <h1>{`${movieInfo.Title} (${movieInfo.Year})`}</h1>
            <RatingDialog
              isOpen={isDialogOpen}
              onClose={handleDialogClose}
              movieInfo={movieInfo}
            />
            <div className='movie-page-external-link' title='View on IMDb'>
              <a
                href={`https://www.imdb.com/title/${movieInfo.imdbID}`}
                target='_blank'
                rel='noreferrer'
              >
                <img src={imdbLogo} alt='IMDb' />
              </a>
            </div>
            <div className='movie-page-icon-action' onClick={handleAdd}>
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
        </>
      ) : (
        <NoData />
      )}
    </div>
  );
}

export default MoviePage;
