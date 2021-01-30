import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dotenv from 'dotenv';
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
  let dispatch = useDispatch();

  const tmdbAPI = 'https://api.themoviedb.org/3/movie';
  const tmdbSearchAPI = 'https://api.themoviedb.org/3/search';
  const omdbAPI = 'http://www.omdbapi.com';

  dotenv.config();
  const tmdbKey = process.env.REACT_APP_TMDB_API_KEY;
  const omdbKey = process.env.REACT_APP_OMDB_API_KEY;

  const tmdbMovies = props.isSearch
    ? tmdbSearchAPI +
      `/movie?api_key=${tmdbKey}&language=en-US&query=${searchQuery}&page=1&include_adult=false`
    : tmdbAPI +
      `/now_playing?api_key=${tmdbKey}&language=en-US&page=1&region=${regionCode}`;

  type TMDbMovie = Readonly<{
    adult: boolean;
    backdrop_path: string;
    genre_ids: Array<number>;
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }>;
  type OMDbMovie = Readonly<{
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: Array<Object>;
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
  }>;

  let [movies, setMovies] = useState<Array<OMDbMovie | MovieRatingInfo>>([]);
  let [isError, setError] = useState(false);

  useEffect(() => {
    setMovies([]);
    setError(false);

    axios
      .get(tmdbMovies)
      .then((res) => {
        let movies: Array<TMDbMovie> = res.data.results;

        Promise.all(
          movies.map((movie: TMDbMovie) => {
            const externalIDs =
              tmdbAPI + `/${movie.id}/external_ids?api_key=${tmdbKey}`;
            return axios
              .get(externalIDs)
              .then((res) => {
                let imdbID = res.data.imdb_id;

                return axios.get(
                  `http://localhost:5000/movieratings/${user.uid}/${imdbID}`
                );
              })
              .then((res) => {
                const movieInfo = res.data;

                if (movieInfo.title) {
                  return Promise.resolve({ data: movieInfo });
                }

                const movieDetails =
                  omdbAPI + `/?i=${movieInfo.id}&apikey=${omdbKey}`;
                return axios.get(movieDetails);
              })
              .then((res) => res.data)
              .catch(() => {
                return {};
              });
          })
        ).then((res) => {
          setMovies(res);
          dispatch(loading(false));
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch(loading(false));
        setError(true);
      });

    return () => {
      dispatch(loading(true));
      dispatch(updateRating(false));
    };
  }, [tmdbKey, omdbKey, tmdbMovies, dispatch, user.uid, isRatingUpdated]);

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
            return key && <MovieCard key={key} movieInfo={movie} />;
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
