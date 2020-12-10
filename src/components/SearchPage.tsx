import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dotenv from 'dotenv';
import axios from 'axios';
import MovieCard from './MovieCard';

interface RootState {
  searchQuery: string;
}

function SearchPage() {
  let searchQuery = useSelector((state: RootState) => state.searchQuery);

  const tmdbAPI = 'https://api.themoviedb.org/3/movie';
  const tmdbSearchAPI = 'https://api.themoviedb.org/3/search';
  const omdbAPI = 'http://www.omdbapi.com';

  dotenv.config();
  const tmdbKey = process.env.REACT_APP_TMDB_API_KEY;
  const omdbKey = process.env.REACT_APP_OMDB_API_KEY;

  const searchMovies =
    tmdbSearchAPI +
    `/movie?api_key=${tmdbKey}&language=en-US&query=${searchQuery}&page=1&include_adult=false`;

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

  let [searchResults, setSearchResults] = useState<Array<OMDbMovie>>([]);

  useEffect(() => {
    setSearchResults([]);

    axios
      .get(searchMovies)
      .then((res) => {
        let movies: Array<TMDbMovie> = res.data.results;

        movies.forEach((movie: TMDbMovie) => {
          const externalIDs =
            tmdbAPI + `/${movie.id}/external_ids?api_key=${tmdbKey}`;
          axios
            .get(externalIDs)
            .then((res) => {
              let imdbID = res.data.imdb_id;
              const movieDetails = omdbAPI + `/?i=${imdbID}&apikey=${omdbKey}`;
              return axios.get(movieDetails);
            })
            .then((res) => {
              setSearchResults((prevResults) => [...prevResults, res.data]);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchMovies, omdbKey, tmdbKey]);

  return (
    <div className='search-page-wrapper'>
      {searchQuery.length > 0 && <h1>Showing results for "{searchQuery}"</h1>}
      <div className='search-results-grid'>
        {[...searchResults]
          .sort((a, b) => ('' + a.Title).localeCompare(b.Title))
          .map((movie: OMDbMovie) => (
            <MovieCard
              key={movie.imdbID}
              title={movie.Title}
              rating={movie.imdbRating}
              poster={movie.Poster}
            />
          ))}
      </div>
    </div>
  );
}

export default SearchPage;
