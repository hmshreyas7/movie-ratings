import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import MovieCard from './MovieCard';
import { RootState } from '../rootState';
import { CircularProgress } from '@material-ui/core';
import { loading, setRegion, updateRating } from '../actions';
import NoData from './NoData';
import Select from 'react-select';
import regionOptions from '../regionOptions';

interface MovieGridProps {
  isSearch: boolean;
}

function MovieGrid(props: MovieGridProps) {
  let searchQuery = useSelector((state: RootState) => state.searchQuery);
  let isLoading = useSelector((state: RootState) => state.isLoading);
  let regionCode = useSelector((state: RootState) => state.regionCode);
  let user = useSelector((state: RootState) => state.user);
  let isRatingUpdated = useSelector(
    (state: RootState) => state.isRatingUpdated
  );
  let isWatchNextToggled = useSelector(
    (state: RootState) => state.isWatchNextToggled
  );
  let dispatch = useDispatch();

  let [movies, setMovies] = useState<Array<OMDbMovie | MovieRatingInfo>>([]);
  let [isError, setError] = useState(false);

  const { isSearch } = props;

  useEffect(() => {
    setMovies([]);
    setError(false);

    axios
      .get(
        `/movies/${user.uid}?isSearch=${isSearch}&searchQuery=${searchQuery}&regionCode=${regionCode}`
      )
      .then((res) => {
        setMovies(res.data);
        dispatch(loading(false));
      })
      .catch((err) => {
        console.log(err.response.data);
        dispatch(loading(false));
        setError(true);
      });

    return () => {
      dispatch(loading(true));
      dispatch(updateRating(false));
    };
  }, [
    isSearch,
    searchQuery,
    regionCode,
    dispatch,
    user.uid,
    isRatingUpdated,
    isWatchNextToggled,
  ]);

  const handleChange = (selected: any) => {
    dispatch(setRegion(selected ? selected.value : ''));
  };

  const getKey = (movie: OMDbMovie | MovieRatingInfo) => {
    if (typeof movie === 'string') {
      return null;
    }

    if ('imdbID' in movie) {
      return movie.imdbID;
    } else {
      return movie.id;
    }
  };

  if (!isError) {
    return (
      <div className='movie-grid-wrapper'>
        {isLoading && (
          <div className='loading-indicator'>
            <CircularProgress color='inherit' />
          </div>
        )}
        {!props.isSearch && (
          <div className='movie-grid-header-wrapper'>
            <h1>Now Playing</h1>
            <div className='region-select'>
              <Select
                isClearable={regionCode !== ''}
                backspaceRemovesValue={false}
                name='regionSetting'
                options={regionOptions}
                onChange={handleChange}
                value={{
                  value: regionCode,
                  label: regionOptions.filter(
                    (region) => region.value === regionCode
                  )[0].label,
                }}
              />
            </div>
          </div>
        )}
        {props.isSearch && searchQuery.length > 0 && (
          <h1>Showing results for "{searchQuery}"</h1>
        )}
        <div className='movie-grid'>
          {[...movies].map((movie: OMDbMovie | MovieRatingInfo) => {
            const key = getKey(movie);
            return (
              key && (
                <MovieCard
                  key={key}
                  movieInfo={movie}
                  isMovieGridParent={true}
                />
              )
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className='movie-grid-wrapper'>
        <NoData />
      </div>
    );
  }
}

MovieGrid.defaultProps = {
  isSearch: false,
};

export default MovieGrid;
