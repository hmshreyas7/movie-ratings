import {
  Add,
  CalendarToday,
  Edit,
  Grade,
  MovieFilter,
  Schedule,
} from '@material-ui/icons';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../rootState';
import NoData from './NoData';
import RatingDialog from './RatingDialog';
import imdbLogo from '../assets/imdb-logo.png';

function MoviePage() {
  const movieInfo = useSelector((state: RootState) => state.movieInfo);
  const moviePosterPosition = useSelector(
    (state: RootState) => state.posterPosition
  );
  const user = useSelector((state: RootState) => state.user);
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
        }
      : movieInfo;

  let history = useHistory();
  let [isDialogOpen, setDialogOpen] = useState(false);

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
  }, [mediaQueryMatch]);

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
    <div
      className='movie-page-wrapper'
      style={pageWrapperStyle}
      ref={pageWrapperRef}
    >
      {id ? (
        <>
          <div className='movie-page-header'>
            <h1>{`${title} (${year})`}</h1>
            <RatingDialog
              isOpen={isDialogOpen}
              onClose={handleDialogClose}
              movieInfo={movieInfo}
            />
            <div className='movie-page-external-link' title='View on IMDb'>
              <a
                href={`https://www.imdb.com/title/${id}`}
                target='_blank'
                rel='noreferrer'
              >
                <img src={imdbLogo} alt='IMDb' />
              </a>
            </div>
            <div
              className='movie-page-icon-action'
              onClick={handleAdd}
              title={'imdbID' in movieInfo ? 'Add' : 'Edit'}
            >
              {'imdbID' in movieInfo ? <Add /> : <Edit />}
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
