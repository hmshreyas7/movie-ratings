import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { loading, updateRating } from '../actions';
import { genres, runtimes, sorts } from '../filterSortOptions';
import { RootState } from '../rootState';
import MovieCard from './MovieCard';
import NoData from './NoData';

function WatchNextPage() {
  const user = useSelector((state: RootState) => state.user);
  let isLoading = useSelector((state: RootState) => state.isLoading);
  let isWatchNextToggled = useSelector(
    (state: RootState) => state.isWatchNextToggled
  );
  let isRatingUpdated = useSelector(
    (state: RootState) => state.isRatingUpdated
  );
  let [movies, setMovies] = useState<Array<OMDbMovie>>([]);
  let [filterSort, setFilterSort] = useState<FilterSort>({
    runtimeFilter: [],
    genreFilter: [],
    decadeFilter: [],
    sortSetting: null,
  });
  let [movieCount, setMovieCount] = useState(0);
  let [hasMovies, setHasMovies] = useState(true);
  let dispatch = useDispatch();

  useEffect(() => {
    if (user.uid) {
      axios
        .get(`/api/watch-next/${user.uid}`)
        .then((res) => {
          setMovies(res.data);
          dispatch(loading(false));
          setHasMovies(res.data.length !== 0);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      dispatch(loading(false));
      setHasMovies(false);
    }

    return () => {
      dispatch(loading(true));
      dispatch(updateRating(false));
    };
  }, [user.uid, dispatch, isWatchNextToggled, isRatingUpdated]);

  const handleChange = (selected: any, e: any) => {
    const name = e.name;

    setFilterSort((prevValue) => {
      return {
        ...prevValue,
        [name]: selected,
      };
    });
  };

  const handleClear = () => {
    setFilterSort({
      runtimeFilter: [],
      genreFilter: [],
      decadeFilter: [],
      sortSetting: null,
    });
  };

  const getDecades = () =>
    [...new Set([...movies].map((movie) => `${movie.Year.slice(0, 3)}0s`))]
      .sort((a, b) => a.localeCompare(b))
      .map((decade) => {
        return {
          value: decade,
          label: decade,
        };
      });

  const getMovies = () => {
    let filteredMovies = [...movies].filter((movie) => {
      const runtime = parseInt(movie.Runtime.slice(0, -4));
      let runtimeInterval = '';

      if (runtime < 60) {
        runtimeInterval = '< 60 min';
      } else if (runtime < 90) {
        runtimeInterval = '60-89 min';
      } else if (runtime < 120) {
        runtimeInterval = '90-119 min';
      } else if (runtime < 150) {
        runtimeInterval = '120-149 min';
      } else if (runtime < 180) {
        runtimeInterval = '150-179 min';
      } else {
        runtimeInterval = '180+ min';
      }

      const runtimeFilterLabels = filterSort.runtimeFilter?.map(
        (runtime) => runtime.label
      );
      let isWithinRuntimeInterval = true;

      if (
        runtimeFilterLabels &&
        runtimeFilterLabels.length !== 0 &&
        !runtimeFilterLabels.includes(runtimeInterval)
      ) {
        isWithinRuntimeInterval = false;
      }

      const genres = movie.Genre.split(', ');
      let isGenrePresent = true;

      filterSort.genreFilter?.forEach((genre) => {
        if (!genres.includes(genre.label)) {
          isGenrePresent = false;
        }
      });

      const decade = `${movie.Year.slice(0, 3)}0s`;
      const decadeFilterLabels = filterSort.decadeFilter?.map(
        (decade) => decade.label
      );
      let matchesDecade = true;

      if (
        decadeFilterLabels &&
        decadeFilterLabels.length !== 0 &&
        !decadeFilterLabels.includes(decade)
      ) {
        matchesDecade = false;
      }

      return isWithinRuntimeInterval && isGenrePresent && matchesDecade;
    });

    if (movieCount !== filteredMovies.length) {
      setMovieCount(filteredMovies.length);
    }

    switch (filterSort.sortSetting?.value) {
      case 'alpha':
        filteredMovies.sort((a, b) => a.Title.localeCompare(b.Title));
        break;
      case 'rating':
        filteredMovies.sort((a, b) => {
          const imdbRatingA = isNaN(Number(a.imdbRating))
            ? 0
            : Number(a.imdbRating);
          const imdbRatingB = isNaN(Number(b.imdbRating))
            ? 0
            : Number(b.imdbRating);

          return imdbRatingB - imdbRatingA;
        });
        break;
      case 'num_ratings':
        filteredMovies.sort((a, b) => b.Votes - a.Votes);
        break;
      case 'release':
        filteredMovies.sort(
          (a, b) =>
            new Date(b.Released).getTime() - new Date(a.Released).getTime()
        );
        break;
    }

    return filteredMovies.map((movie) => (
      <MovieCard key={movie.imdbID} movieInfo={movie} />
    ));
  };

  return (
    <div className='watch-next-page-wrapper'>
      {isLoading && (
        <div className='loading-indicator'>
          <CircularProgress color='inherit' />
        </div>
      )}
      {hasMovies ? (
        <>
          <h1 className='watch-next-info'>
            {movieCount} {movieCount === 1 ? 'movie' : 'movies'}
          </h1>
          <div className='filter-sort'>
            <Select
              isMulti
              name='runtimeFilter'
              options={runtimes}
              value={filterSort.runtimeFilter}
              placeholder='Runtime'
              onChange={handleChange}
            />
            <Select
              isMulti
              name='genreFilter'
              options={genres}
              value={filterSort.genreFilter}
              placeholder='Genre'
              onChange={handleChange}
            />
            <Select
              isMulti
              name='decadeFilter'
              options={getDecades()}
              value={filterSort.decadeFilter}
              placeholder='Decade'
              onChange={handleChange}
            />
            <Select
              isClearable
              name='sortSetting'
              options={sorts}
              value={filterSort.sortSetting}
              placeholder='Sort'
              onChange={handleChange}
            />
          </div>
          <div className='filter-sort-clear-button' onClick={handleClear}>
            Clear
          </div>
          <div className='movie-grid'>{getMovies()}</div>
        </>
      ) : (
        <NoData />
      )}
    </div>
  );
}

export default WatchNextPage;
