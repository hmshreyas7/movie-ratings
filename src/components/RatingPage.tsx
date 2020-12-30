import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { genres, sorts } from '../filterSortOptions';
import { RootState } from '../rootState';
import RatingCard from './RatingCard';
import Select from 'react-select';
import { useHistory } from 'react-router-dom';

type SelectedOption = {
  value: string;
  label: string;
};

function RatingPage() {
  const user = useSelector((state: RootState) => state.user);
  let [movies, setMovies] = useState<Array<MovieRatingInfo>>([]);
  let [filterSort, setFilterSort] = useState({
    genreFilter: [] as SelectedOption[],
    sortSetting: {} as SelectedOption,
  });
  let [ratingCount, setRatingCount] = useState(0);
  let history = useHistory();

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
      <RatingCard key={ratingInfo.id} movieInfo={ratingInfo} />
    ));
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/movieratings/${user.uid}`)
      .then((res) => {
        setMovies(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.uid]);

  const goToRatingStatsPage = () => {
    history.push('/rating-stats');
  };

  return (
    <div className='rating-page-wrapper'>
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
    </div>
  );
}

export default RatingPage;
