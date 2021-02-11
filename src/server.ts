import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongodb = {
  user: process.env.MONGODB_ATLAS_USERNAME,
  pass: process.env.MONGODB_ATLAS_PASSWORD,
};
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, '../build')));
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  `mongodb+srv://${mongodb.user}:${mongodb.pass}@cluster0.t6bhw.mongodb.net/movieRatingsDB?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

type MovieRating = Readonly<{
  movieID: string;
  rating: number;
  timestamp: string;
}>;

const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  birthday: String,
  joinDateTime: String,
  lastSignInDateTime: String,
  movieRatings: Array<MovieRating>(),
});

const User = mongoose.model('User', userSchema);

const movieSchema = new mongoose.Schema({
  _id: String,
  title: String,
  poster: String,
  genres: String,
  runtime: String,
  releaseDate: String,
});

const Movie = mongoose.model('Movie', movieSchema);

const getMovieRatingInfo = (
  userID: string,
  movieID: string,
  movieDetails: string
) => {
  return User.findOne(
    {
      _id: userID,
    },
    {
      movieRatings: {
        $elemMatch: {
          movieID: movieID,
        },
      },
    }
  )
    .then((response: any) => {
      if (response && response.movieRatings.length === 1) {
        const movieRating = response.movieRatings[0];

        return Movie.findById(movieID).then((response) => {
          if (response) {
            return {
              id: movieID,
              title: response.get('title'),
              poster: response.get('poster'),
              genres: response.get('genres'),
              rating: movieRating.rating,
              timestamp: movieRating.timestamp,
            } as MovieRatingInfo;
          }
        });
      } else {
        return {
          id: movieID,
        } as MovieRatingInfo;
      }
    })
    .then((response): any => {
      if (response) {
        const movieInfo = response;

        if (movieInfo.title) {
          return Promise.resolve({ data: movieInfo });
        }

        return axios.get(movieDetails);
      }
    });
};

const setMailchimpInfo = (email: string, birthday: string, name?: string) => {
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX!;
  const apiKey = process.env.MAILCHIMP_API_KEY!;
  const listID = process.env.MAILCHIMP_LIST_ID!;

  const [fname, ...lname] = name ? name.split(' ') : [];
  const combinedLname = lname.join(' ');
  const formattedBirthday = birthday.slice(-5).split('-').join('/');

  const mergeFields = name
    ? {
        FNAME: fname,
        LNAME: combinedLname,
        BIRTHDAY: formattedBirthday,
      }
    : {
        BIRTHDAY: formattedBirthday,
      };

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: mergeFields,
      },
    ],
    update_existing: name === undefined,
  };

  const JSONData = JSON.stringify(data);
  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listID}`;

  axios({
    url: url,
    method: 'POST',
    data: JSONData,
    auth: {
      username: 'shosamane',
      password: apiKey,
    },
  })
    .then(() => {
      console.log('Subscribed/updated');
    })
    .catch((err) => {
      console.log(err);
    });
};

app.get('/movies/:userID', (req, res) => {
  const tmdbAPI = 'https://api.themoviedb.org/3/movie';
  const tmdbSearchAPI = 'https://api.themoviedb.org/3/search';
  const omdbAPI = 'http://www.omdbapi.com';

  const tmdbKey = process.env.TMDB_API_KEY;
  const omdbKey = process.env.OMDB_API_KEY;

  const { isSearch, searchQuery, regionCode } = req.query;

  const tmdbMovies =
    isSearch === 'true'
      ? tmdbSearchAPI +
        `/movie?api_key=${tmdbKey}&language=en-US&query=${searchQuery}&page=1&include_adult=false`
      : tmdbAPI +
        `/now_playing?api_key=${tmdbKey}&language=en-US&page=1&region=${regionCode}`;

  const userID = req.params.userID;

  axios
    .get(tmdbMovies)
    .then((response) => {
      const movies: Array<TMDbMovie> = response.data.results;

      Promise.all(
        movies.map((movie: TMDbMovie) => {
          const externalIDs =
            tmdbAPI + `/${movie.id}/external_ids?api_key=${tmdbKey}`;
          return axios
            .get(externalIDs)
            .then((response): any => {
              const imdbID = response.data.imdb_id;
              const movieDetails = omdbAPI + `/?i=${imdbID}&apikey=${omdbKey}`;

              if (userID !== 'undefined') {
                return getMovieRatingInfo(userID, imdbID, movieDetails);
              } else {
                return axios.get(movieDetails);
              }
            })
            .then((response) => response.data)
            .catch(() => {
              return {};
            });
        })
      ).then((response) => {
        res.send(response);
      });
    })
    .catch((err) => {
      res.status(err.response.status).send('Data fetch failed');
    });
});

app.post('/login', (req, res) => {
  const {
    _id,
    name,
    email,
    birthday,
    joinDateTime,
    lastSignInDateTime,
  } = req.body;

  User.exists({ _id: _id })
    .then((userExists) => {
      if (userExists) {
        User.updateOne(
          {
            _id: _id,
          },
          {
            lastSignInDateTime: lastSignInDateTime,
          },
          (err, res) => {
            if (err) {
              console.log(err);
            }
          }
        );
      } else {
        const loggedInUser = new User({
          _id: _id,
          name: name,
          email: email,
          birthday: birthday,
          joinDateTime: joinDateTime,
          lastSignInDateTime: lastSignInDateTime,
          movieRatings: [],
        });
        loggedInUser.save();

        setMailchimpInfo(email, birthday, name);
      }
      res.send('User login success');
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/facebook-photo', (req, res) => {
  const photoURL = req.query.photoURL;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

  axios
    .get(`${photoURL}?width=1000&access_token=${accessToken}&redirect=false`)
    .then((response) => {
      res.send(response.data.data.url);
    })
    .catch((err) => {
      res.status(err.response.status).send('Facebook photo fetch failed');
    });
});

app.post('/rate', (req, res) => {
  const { userID, movie, rating, timestamp } = req.body;
  const isOMDbMovie = 'imdbID' in movie;
  const movieRating: MovieRating = {
    movieID: isOMDbMovie ? movie.imdbID : movie.id,
    rating: rating,
    timestamp: timestamp,
  };

  Movie.exists({ _id: movieRating.movieID })
    .then((movieExists) => {
      if (!movieExists) {
        const newMovie = new Movie({
          _id: movie.imdbID,
          title: movie.Title,
          poster: movie.Poster,
          genres: movie.Genre,
          runtime: movie.Runtime,
          releaseDate: movie.Released,
        });
        newMovie.save();
      }
    })
    .catch((err) => {
      console.log(err);
    });

  if (isOMDbMovie) {
    User.updateOne(
      {
        _id: userID,
      },
      {
        $push: {
          movieRatings: movieRating,
        },
      },
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          res.send('Rating received');
        }
      }
    );
  } else {
    User.updateOne(
      {
        _id: userID,
        'movieRatings.movieID': movieRating.movieID,
      },
      {
        $set: {
          'movieRatings.$.rating': movieRating.rating,
        },
      },
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          res.send('Rating updated');
        }
      }
    );
  }
});

app.delete('/delete-rating/:userID/:movieID', (req, res) => {
  const { userID, movieID } = req.params;

  User.updateOne(
    {
      _id: userID,
    },
    {
      $pull: {
        movieRatings: {
          movieID: movieID,
        },
      },
    },
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send('Rating deleted');
      }
    }
  );
});

app.get('/watchstats/:userID', (req, res) => {
  const userID = req.params.userID;

  let userMovieRatings = Array<MovieRating>();

  User.findById(userID).then((response) => {
    if (response) {
      userMovieRatings = response.get('movieRatings');
      let hoursWatched = Array<number>();
      let ratingsByGenre: Record<string, Array<number>> = {};
      let favoriteGenres: Record<string, string> = {};
      let ratingsByDecade: Record<string, Array<number>> = {};
      let favoriteDecades: Record<string, string> = {};

      let favoriteMovieIDs = [...userMovieRatings]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5)
        .map((rating) => rating.movieID);
      let topRatedMovies = Array<{}>();

      Promise.all(
        userMovieRatings.map((movieRating) => {
          const movieID = movieRating.movieID;
          const rating = movieRating.rating;

          return Movie.findById(movieID).then((response) => {
            if (response) {
              const runtime = response.get('runtime').slice(0, -4);
              hoursWatched.push(parseInt(runtime));

              response
                .get('genres')
                .split(', ')
                .forEach((genre: string) => {
                  if (ratingsByGenre.hasOwnProperty(genre)) {
                    ratingsByGenre[genre].push(rating);
                  } else {
                    ratingsByGenre[genre] = [rating];
                  }
                });

              const releaseDecade = `${response
                .get('releaseDate')
                .slice(-4, -1)}0s`;
              if (ratingsByDecade.hasOwnProperty(releaseDecade)) {
                ratingsByDecade[releaseDecade].push(rating);
              } else {
                ratingsByDecade[releaseDecade] = [rating];
              }

              if (favoriteMovieIDs.includes(movieID)) {
                topRatedMovies.push({
                  id: movieID,
                  title: response.get('title'),
                  poster: response.get('poster'),
                  rating: rating,
                });
              }
            }
          });
        })
      )
        .then((response) => {
          for (const genre in ratingsByGenre) {
            favoriteGenres[genre] = (
              ratingsByGenre[genre].reduce((val, acc) => acc + val) /
              ratingsByGenre[genre].length
            ).toFixed(2);
          }

          for (const decade in ratingsByDecade) {
            favoriteDecades[decade] = (
              ratingsByDecade[decade].reduce((val, acc) => acc + val) /
              ratingsByDecade[decade].length
            ).toFixed(2);
          }

          let totalHoursWatched =
            hoursWatched.length > 0
              ? hoursWatched.reduce((acc, value) => acc + value) / 60
              : 0;

          const sortedFavoriteGenres = Object.entries(favoriteGenres)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));

          const sortedFavoriteDecades = Object.entries(favoriteDecades)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));

          res.send({
            hoursWatched: Math.round(totalHoursWatched),
            favoriteGenres: sortedFavoriteGenres.slice(0, 5),
            favoriteDecade:
              sortedFavoriteDecades.length > 0
                ? sortedFavoriteDecades[0][0]
                : '',
            topRatedMovies: topRatedMovies,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

app.get('/movieratings/:userID', (req, res) => {
  const userID = req.params.userID;
  let userMovieRatings = Array<MovieRating>();

  User.findById(userID).then((response) => {
    if (response) {
      userMovieRatings = response.get('movieRatings');

      Promise.all(
        userMovieRatings.map((movieRating) => {
          const movieID = movieRating.movieID;

          return Movie.findById(movieID)
            .then((response) => {
              if (response) {
                return {
                  id: movieID,
                  title: response.get('title'),
                  poster: response.get('poster'),
                  genres: response.get('genres'),
                  rating: movieRating.rating,
                  timestamp: movieRating.timestamp,
                } as MovieRatingInfo;
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
      )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

app.get('/movie-rating-stats/:userID', (req, res) => {
  const userID = req.params.userID;
  let userMovieRatings = Array<MovieRating>();

  User.findById(userID)
    .then((response) => {
      if (response) {
        userMovieRatings = response.get('movieRatings');
        let ratingDistribution: Record<number, number> = {
          10: 0,
          9: 0,
          8: 0,
          7: 0,
          6: 0,
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        };
        let ratingsByGenre: Record<string, Array<number>> = {};
        let favoriteGenres: Record<string, Array<string>> = {};
        let ratingsByRuntime: Record<string, Array<number>> = {
          '< 60 min': [],
          '60-89 min': [],
          '90-119 min': [],
          '120-149 min': [],
          '150-179 min': [],
          '180+ min': [],
        };
        let avgRatingsByRuntime: Record<string, Array<string>> = {};
        let ratingsByDecade: Record<string, Array<number>> = {};
        let avgRatingsByDecade: Record<string, Array<string>> = {};

        userMovieRatings.forEach((movieRating) => {
          ratingDistribution[movieRating.rating] += 1;
        });

        Promise.all(
          userMovieRatings.map((movieRating) => {
            const movieID = movieRating.movieID;
            const rating = movieRating.rating;

            return Movie.findById(movieID).then((response) => {
              if (response) {
                const runtime = parseInt(response.get('runtime').slice(0, -4));
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
                ratingsByRuntime[runtimeInterval].push(rating);

                response
                  .get('genres')
                  .split(', ')
                  .forEach((genre: string) => {
                    if (ratingsByGenre.hasOwnProperty(genre)) {
                      ratingsByGenre[genre].push(rating);
                    } else {
                      ratingsByGenre[genre] = [rating];
                    }
                  });

                const releaseDecade = `${response
                  .get('releaseDate')
                  .slice(-4, -1)}0s`;
                if (ratingsByDecade.hasOwnProperty(releaseDecade)) {
                  ratingsByDecade[releaseDecade].push(rating);
                } else {
                  ratingsByDecade[releaseDecade] = [rating];
                }
              }
            });
          })
        )
          .then((response) => {
            for (const runtime in ratingsByRuntime) {
              const temp = ratingsByRuntime[runtime];
              avgRatingsByRuntime[runtime] = [
                temp.length > 0
                  ? (
                      temp.reduce((val, acc) => acc + val) / temp.length
                    ).toFixed(2)
                  : '0.00',
                `(${temp.length})`,
              ];
            }

            for (const genre in ratingsByGenre) {
              const temp = ratingsByGenre[genre];
              favoriteGenres[genre] = [
                (temp.reduce((val, acc) => acc + val) / temp.length).toFixed(2),
                `(${temp.length})`,
              ];
            }

            for (const decade in ratingsByDecade) {
              const temp = ratingsByDecade[decade];
              avgRatingsByDecade[decade] = [
                (temp.reduce((val, acc) => acc + val) / temp.length).toFixed(2),
                `(${temp.length})`,
              ];
            }

            const sortedFavoriteGenres = Object.entries(favoriteGenres)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .sort((a, b) => parseFloat(b[1][0]) - parseFloat(a[1][0]));

            const sortedAvgRatingsByDecade = Object.entries(
              avgRatingsByDecade
            ).sort((a, b) => a[0].localeCompare(b[0]));

            res.send({
              totalRatings: userMovieRatings.length,
              ratingDistribution: ratingDistribution,
              avgRatingsByRuntime: Object.entries(avgRatingsByRuntime),
              favoriteGenres: sortedFavoriteGenres,
              avgRatingsByDecade: sortedAvgRatingsByDecade,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/profile-info/:userID', (req, res) => {
  const userID = req.params.userID;

  User.findById(userID).then((response) => {
    if (response) {
      const email = response.get('email');
      const birthday = response.get('birthday');
      res.send({
        email,
        birthday,
      });
    }
  });
});

app.post('/profile-info', (req, res) => {
  const { userID, email, birthday } = req.body;

  User.updateOne(
    {
      _id: userID,
    },
    {
      $set: {
        email: email,
        birthday: birthday,
      },
    },
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send('Profile info updated');
      }
    }
  );

  setMailchimpInfo(email, birthday);
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
