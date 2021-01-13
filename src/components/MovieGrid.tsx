import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dotenv from 'dotenv';
import axios from 'axios';
import MovieCard from './MovieCard';
import { RootState } from '../rootState';
import { CircularProgress } from '@material-ui/core';
import { loading } from '../actions';
import NoData from './NoData';

interface MovieGridProps {
  isSearch: boolean;
}

function MovieGrid(props: MovieGridProps) {
  let searchQuery = useSelector((state: RootState) => state.searchQuery);
  let isLoading = useSelector((state: RootState) => state.isLoading);
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
    : tmdbAPI + `/now_playing?api_key=${tmdbKey}&language=en-US&page=1`;

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

  let [movies, setMovies] = useState<Array<OMDbMovie>>([]);
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
                const movieDetails =
                  omdbAPI + `/?i=${imdbID}&apikey=${omdbKey}`;
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
    };
  }, [tmdbKey, omdbKey, tmdbMovies, dispatch]);

  if (!isError) {
    return (
      <div className='movie-grid-wrapper'>
        {isLoading && (
          <div className='loading-indicator'>
            <CircularProgress color='inherit' />
          </div>
        )}
        {!props.isSearch && <h1>Now Playing</h1>}
        {props.isSearch && searchQuery.length > 0 && (
          <h1>Showing results for "{searchQuery}"</h1>
        )}
        <div className='movie-grid'>
          {[...movies].map(
            (movie: OMDbMovie) =>
              movie.imdbID && <MovieCard key={movie.imdbID} movieInfo={movie} />
          )}
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
