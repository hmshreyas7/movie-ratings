import {
  Add,
  CalendarToday,
  Delete,
  Edit,
  Grade,
  MovieFilter,
  Remove,
  Schedule,
} from '@material-ui/icons';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { RootState } from '../rootState';
import NoData from './NoData';
import RatingDialog from './RatingDialog';
import imdbLogo from '../assets/imdb-logo.png';
import ConfirmationDialog from './ConfirmationDialog';
import axios from 'axios';
import {
  toggleActionConfirmation,
  loading,
  toggleWatchNext,
  updateRating,
  viewMovieDetails,
} from '../actions';
import { CircularProgress } from '@material-ui/core';

function MoviePage() {
  const movieInfo = useSelector((state: RootState) => state.movieInfo);
  const moviePosterPosition = useSelector(
    (state: RootState) => state.posterPosition
  );
  const user = useSelector((state: RootState) => state.user);
  const isLoading = useSelector((state: RootState) => state.isLoading);
  const isWatchNextToggled = useSelector(
    (state: RootState) => state.isWatchNextToggled
  );
  const isRatingUpdated = useSelector(
    (state: RootState) => state.isRatingUpdated
  );
  const {
    id,
    poster,
    title,
    genres,
    runtime,
    releaseDate,
    imdbRating,
    imdbVotes,
    year,
    plot,
    timestamp,
  } =
    'imdbID' in movieInfo
      ? {
          id: movieInfo.imdbID,
          poster: movieInfo.Poster,
          title: movieInfo.Title,
          genres: movieInfo.Genre,
          runtime: movieInfo.Runtime,
          releaseDate: movieInfo.Released,
          imdbRating: movieInfo.imdbRating,
          imdbVotes: movieInfo.imdbVotes,
          year: movieInfo.Year,
          plot: movieInfo.Plot,
          timestamp: movieInfo.Timestamp,
        }
      : movieInfo;

  let history = useHistory();
  let dispatch = useDispatch();
  const match = useRouteMatch<{ movieID: string }>('/movie/:movieID');
  const urlMovieID = match?.params.movieID;
  let [isDialogOpen, setDialogOpen] = useState(false);
  let [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const pageWrapperRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  const mediaQueryMatch = window.matchMedia('(max-width: 600px)').matches;

  const cardHeight = '300px',
    cardWidth = '200px',
    posterHeight = '450px',
    posterWidth = '300px',
    cardShadowColor = '#00000080';

  const pageWrapperStyle: CSSProperties = {
    visibility: 'hidden',
  };
  const posterParentStyle: CSSProperties = {
    boxShadow: 'none',
    visibility: 'visible',
  };
  const posterChildStyle: CSSProperties = {
    borderRadius: '20px',
    left: mediaQueryMatch
      ? `${moviePosterPosition.x}px`
      : `calc(${moviePosterPosition.x}px - 240px)`,
    minHeight: cardHeight,
    position: 'absolute',
    top: `${moviePosterPosition.y}px`,
    width: cardWidth,
  };

  useEffect(() => {
    if (id) {
      const childRef = posterRef.current,
        parentRef = posterRef.current?.parentElement;

      const resetStyles = () => {
        pageWrapperRef.current?.removeAttribute('style');
        parentRef?.removeAttribute('style');
        childRef?.removeAttribute('style');
      };

      if (childRef && parentRef) {
        const { x: parentX, y: parentY } = parentRef.getBoundingClientRect();
        const posterChildStyle = `
      border-radius: 20px;
      box-shadow: 0px 0px 8px 2px ${cardShadowColor};
      left: ${mediaQueryMatch ? `${parentX}px` : `calc(${parentX}px - 240px)`};
      min-height: ${posterHeight};
      position: absolute;
      top: ${parentY}px;
      transition-duration: 0.5s;
      transition-property: left, min-height, top, width;
      transition-timing-function: linear;
      width: ${posterWidth};
      `;

        childRef.setAttribute('style', posterChildStyle);
        childRef.addEventListener('transitionend', resetStyles);
      }

      return () => {
        childRef?.removeEventListener('transitionend', resetStyles);
      };
    }
  }, [mediaQueryMatch, id]);

  useEffect(() => {
    axios
      .get(`/api/movie-info/${user.uid}/${urlMovieID}`)
      .then((res) => {
        dispatch(viewMovieDetails(res.data));
        dispatch(loading(false));
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      dispatch(loading(true));
      dispatch(updateRating(false));
    };
  }, [dispatch, isWatchNextToggled, isRatingUpdated, user.uid, urlMovieID]);

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

  const handleWatchNext = () => {
    if (timestamp) {
      setConfirmationDialogOpen(true);
    } else {
      if (user.uid) {
        axios
          .post('/api/watch-next', {
            userID: user.uid,
            movie: movieInfo,
            timestamp: new Date().toString(),
          })
          .then((res) => {
            dispatch(toggleWatchNext());
            dispatch(
              toggleActionConfirmation({
                isOpen: true,
                status: 'success',
                message: res.data,
              })
            );
          })
          .catch((err) => {
            dispatch(
              toggleActionConfirmation({
                isOpen: true,
                status: 'error',
                message: err,
              })
            );
          });
      } else {
        history.push('/login');
      }
    }
  };

  const handleDelete = () => {
    setConfirmationDialogOpen(true);
  };

  const handleConfirmationDialogClose = () => {
    setConfirmationDialogOpen(false);
  };

  return (
    <div
      className='movie-page-wrapper'
      style={id ? pageWrapperStyle : {}}
      ref={pageWrapperRef}
    >
      {isLoading && (
        <div className='loading-indicator'>
          <CircularProgress color='inherit' />
        </div>
      )}
      {id ? (
        <>
          <div className='movie-page-header'>
            <h1>{`${title} (${year})`}</h1>
            <RatingDialog
              isOpen={isDialogOpen}
              onClose={handleDialogClose}
              movieInfo={movieInfo}
            />
            {timestamp && (
              <ConfirmationDialog
                isOpen={isConfirmationDialogOpen}
                onClose={handleConfirmationDialogClose}
                movieInfo={movieInfo}
              />
            )}
            <div className='movie-page-actions'>
              <div className='movie-page-external-link' title='View on IMDb'>
                <a
                  href={`https://www.imdb.com/title/${id}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  <img src={imdbLogo} alt='IMDb' />
                </a>
              </div>
              {!isNaN(new Date(releaseDate).getTime()) &&
                new Date().getTime() >= new Date(releaseDate).getTime() && (
                  <div
                    className='movie-page-icon-action'
                    onClick={handleRate}
                    title={'imdbID' in movieInfo ? 'Rate' : 'Edit'}
                  >
                    {'imdbID' in movieInfo ? <Grade /> : <Edit />}
                  </div>
                )}
              {'imdbID' in movieInfo ? (
                <div
                  className='movie-page-icon-action'
                  onClick={handleWatchNext}
                  title={
                    timestamp ? 'Remove from Watch Next' : 'Add to Watch Next'
                  }
                >
                  {timestamp ? <Remove /> : <Add />}
                </div>
              ) : (
                <div
                  className='movie-page-icon-action'
                  onClick={handleDelete}
                  title='Delete'
                >
                  <Delete />
                </div>
              )}
            </div>
          </div>
          <div className='movie-page-info'>
            <div className='movie-page-info-poster' style={posterParentStyle}>
              <img
                src={poster}
                alt={title}
                style={posterChildStyle}
                ref={posterRef}
              />
            </div>
            <div className='movie-page-info-extra'>
              <p>
                <div className='movie-page-icon' title='Genres'>
                  <MovieFilter />
                </div>
                {genres}
              </p>
              <div className='movie-page-stats'>
                <p>
                  <div className='movie-page-icon' title='Runtime'>
                    <Schedule />
                  </div>
                  {runtime}
                </p>
                {parseInt(imdbVotes) > 0 ? (
                  <p>
                    <div
                      className='movie-page-icon'
                      title='IMDb rating & votes'
                    >
                      <Grade />
                    </div>
                    {imdbRating} ({imdbVotes})
                  </p>
                ) : (
                  <p>
                    <div
                      className='movie-page-icon'
                      title='IMDb rating & votes'
                    >
                      <Grade />
                    </div>
                    N/A (N/A)
                  </p>
                )}
                <p>
                  <div className='movie-page-icon' title='Release date'>
                    <CalendarToday />
                  </div>
                  {releaseDate}
                </p>
              </div>
              <p>{plot}</p>
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
