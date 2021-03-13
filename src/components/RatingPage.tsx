import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { genres, runtimes, sorts } from '../filterSortOptions';
import { RootState } from '../rootState';
import Select from 'react-select';
import { useHistory } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { loading, updateRating } from '../actions';
import MovieCard from './MovieCard';
import NoData from './NoData';

type SelectedOption = {
  value: string;
  label: string;
};

function RatingPage() {
  const user = useSelector((state: RootState) => state.user);
  let isLoading = useSelector((state: RootState) => state.isLoading);
  let isRatingUpdated = useSelector(
    (state: RootState) => state.isRatingUpdated
  );
  let [movies, setMovies] = useState<Array<MovieRatingInfo>>([]);
  let [filterSort, setFilterSort] = useState({
    runtimeFilter: [] as SelectedOption[],
    genreFilter: [] as SelectedOption[],
    decadeFilter: [] as SelectedOption[],
    sortSetting: {} as SelectedOption,
  });
  let [ratingCount, setRatingCount] = useState(0);
  let [avgRating, setAvgRating] = useState('0.00');
  let [hasRatings, setHasRatings] = useState(true);
  let history = useHistory();
  let dispatch = useDispatch();

  const handleChange = (selected: any, e: any) => {
    const name = e.name;

    setFilterSort((prevValue) => {
      return {
        ...prevValue,
        [name]: selected,
      };
    });
  };

  const getDecades = () =>
    [
      ...new Set(
        [...movies].map((ratingInfo) => `${ratingInfo.year.slice(0, 3)}0s`)
      ),
    ]
      .sort((a, b) => a.localeCompare(b))
      .map((decade) => {
        return {
          value: decade,
          label: decade,
        };
      });

  const getMovies = () => {
    let filteredMovies = [...movies].filter((ratingInfo) => {
      const runtime = parseInt(ratingInfo.runtime.slice(0, -4));
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

      const genres = ratingInfo.genres.split(', ');
      let isGenrePresent = true;

      filterSort.genreFilter?.forEach((genre) => {
        if (!genres.includes(genre.label)) {
          isGenrePresent = false;
        }
      });

      const decade = `${ratingInfo.year.slice(0, 3)}0s`;
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

    let tempAvgRating = 0;

    filteredMovies.forEach((movieRating) => {
      tempAvgRating += movieRating.rating;
    });

    const formattedAvgRating =
      filteredMovies.length > 0
        ? (tempAvgRating / filteredMovies.length).toFixed(2)
        : '0.00';

    if (ratingCount !== filteredMovies.length) {
      setRatingCount(filteredMovies.length);
      setAvgRating(formattedAvgRating);
    }

    switch (filterSort.sortSetting?.value) {
      case 'alpha':
        filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        filteredMovies.sort((a, b) => b.rating - a.rating);
        break;
      case 'num_ratings':
        filteredMovies.sort((a, b) => b.votes - a.votes);
        break;
      case 'release':
        filteredMovies.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        );
        break;
    }

    return filteredMovies.map((ratingInfo) => (
      <MovieCard key={ratingInfo.id} movieInfo={ratingInfo} />
    ));
  };

  useEffect(() => {
    if (user.uid) {
      axios
        .get(`/api/movieratings/${user.uid}`)
        .then((res) => {
          setMovies(res.data.reverse());
          dispatch(loading(false));
          setHasRatings(res.data.length !== 0);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      dispatch(loading(false));
      setHasRatings(false);
    }

    return () => {
      dispatch(loading(true));
      dispatch(updateRating(false));
    };
  }, [user.uid, dispatch, isRatingUpdated]);

  const goToRatingStatsPage = () => {
    history.push('/rating-stats');
  };

  return (
    <div className='rating-page-wrapper'>
      {isLoading && (
        <div className='loading-indicator'>
          <CircularProgress color='inherit' />
        </div>
      )}
      {hasRatings ? (
        <>
          <div className='rating-page-info-wrapper'>
            <h1>
              {ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'}
            </h1>
            <p>Average: {avgRating}</p>
            <div className='stats-button' onClick={goToRatingStatsPage}>
              Stats
            </div>
          </div>
          <div className='filter-sort'>
            <Select
              isMulti
              name='runtimeFilter'
              options={runtimes}
              placeholder='Runtime'
              onChange={handleChange}
            />
            <Select
              isMulti
              name='genreFilter'
              options={genres}
              placeholder='Genre'
              onChange={handleChange}
            />
            <Select
              isMulti
              name='decadeFilter'
              options={getDecades()}
              placeholder='Decade'
              onChange={handleChange}
            />
            <Select
              isClearable
              name='sortSetting'
              options={sorts}
              placeholder='Sort'
              onChange={handleChange}
            />
          </div>
          <div className='movie-grid'>{getMovies()}</div>
        </>
      ) : (
        <NoData />
      )}
    </div>
  );
}

export default RatingPage;
