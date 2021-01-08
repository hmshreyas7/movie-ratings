import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { genres, sorts } from '../filterSortOptions';
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
    genreFilter: [] as SelectedOption[],
    sortSetting: {} as SelectedOption,
  });
  let [ratingCount, setRatingCount] = useState(0);
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

  const getMovies = () => {
    let filteredMovies = [...movies].filter((ratingInfo) => {
      const genres = ratingInfo.genres.split(', ');
      let isGenrePresent = true;

      filterSort.genreFilter?.forEach((genre) => {
        if (!genres.includes(genre.label)) {
          isGenrePresent = false;
        }
      });

      return isGenrePresent;
    });

    if (ratingCount !== filteredMovies.length) {
      setRatingCount(filteredMovies.length);
    }

    if (filterSort.sortSetting?.value !== 'none') {
      switch (filterSort.sortSetting?.value) {
        case 'alpha':
          filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'rating':
          filteredMovies.sort((a, b) => b.rating - a.rating);
      }
    }

    return filteredMovies.map((ratingInfo) => (
      <MovieCard key={ratingInfo.id} movieInfo={ratingInfo} />
    ));
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/movieratings/${user.uid}`)
      .then((res) => {
        setMovies(res.data.reverse());
        dispatch(loading(false));
        res.data.length === 0 && setHasRatings(false);
      })
      .catch((err) => {
        console.log(err);
      });

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
            <div className='stats-button' onClick={goToRatingStatsPage}>
              Stats
            </div>
          </div>
          <div className='filter-sort'>
            <Select
              isMulti
              name='genreFilter'
              options={genres}
              placeholder='Genre'
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
