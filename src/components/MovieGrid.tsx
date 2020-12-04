import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';
import dotenv from 'dotenv';

function MovieGrid() {
  const tmdbAPI = 'https://api.themoviedb.org/3/movie';
  const omdbAPI = 'http://www.omdbapi.com';

  dotenv.config();
  const tmdbKey = process.env.REACT_APP_TMDB_API_KEY;
  const omdbKey = process.env.REACT_APP_OMDB_API_KEY;

  const nowPlayingMovies =
    tmdbAPI + `/now_playing?api_key=${tmdbKey}&language=en-US&page=1`;

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

  let [nowPlaying, setNowPlaying] = useState<Array<OMDbMovie>>([]);

  useEffect(() => {
    axios
      .get(nowPlayingMovies)
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
              setNowPlaying((prevNowPlaying) => [...prevNowPlaying, res.data]);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [nowPlayingMovies, omdbKey, tmdbKey]);

  return (
    <div className='now-playing-movies-wrapper'>
      <h1>Now Playing</h1>
      <div className='now-playing-movies-grid'>
        {[...nowPlaying]
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

export default MovieGrid;
