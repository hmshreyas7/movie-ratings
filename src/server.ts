import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/movieRatingsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

type MovieRating = Readonly<{
  movieID: string;
  rating: number;
}>;

const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
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

app.get('/', (req, res) => {
  res.send('Hello');
});

app.post('/login', (req, res) => {
  const { _id, name, joinDateTime, lastSignInDateTime } = req.body;

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
          joinDateTime: joinDateTime,
          lastSignInDateTime: lastSignInDateTime,
          movieRatings: [],
        });
        loggedInUser.save();
      }
      res.send('User login success');
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/rate', (req, res) => {
  const { userID, movie, rating } = req.body;
  const movieRating: MovieRating = {
    movieID: movie.imdbID,
    rating: rating,
  };

  Movie.exists({ _id: movie.imdbID })
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
});

app.get('/watchstats/:userID', (req, res) => {
  const userID = req.params.userID;

  let userMovieRatings = Array<MovieRating>();

  User.findById(userID, (err, response) => {
    if (!err && response) {
      userMovieRatings = response.get('movieRatings');
      let hoursWatched = Array<number>();
      let ratingsByGenre: Record<string, Array<number>> = {};
      let favoriteGenres: Record<string, string> = {};
      let ratingsByDecade: Record<string, Array<number>> = {};
      let favoriteDecades: Record<string, string> = {};

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
            hoursWatched.reduce((acc, value) => acc + value) / 60;

          const sortedFavoriteGenres = Object.entries(favoriteGenres)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));

          const sortedFavoriteDecades = Object.entries(favoriteDecades)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));

          res.send({
            hoursWatched: Math.round(totalHoursWatched),
            favoriteGenres: sortedFavoriteGenres.slice(0, 5),
            favoriteDecades: sortedFavoriteDecades.slice(0, 5),
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
        let avgRating = 0,
          ratingDistribution: Record<number, number> = {
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
        let favoriteGenres: Record<string, string> = {};
        let ratingsByRuntime: Record<string, Array<number>> = {
          '< 60 min': [],
          '60-89 min': [],
          '90-119 min': [],
          '120-149 min': [],
          '150-179 min': [],
          '180+ min': [],
        };
        let avgRatingsByRuntime: Record<string, string> = {};
        let ratingsByDecade: Record<string, Array<number>> = {};
        let avgRatingsByDecade: Record<string, string> = {};

        userMovieRatings.forEach((movieRating) => {
          avgRating += movieRating.rating;
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
              avgRatingsByRuntime[runtime] =
                ratingsByRuntime[runtime].length > 0
                  ? (
                      ratingsByRuntime[runtime].reduce(
                        (val, acc) => acc + val
                      ) / ratingsByRuntime[runtime].length
                    ).toFixed(2)
                  : '0.00';
            }

            for (const genre in ratingsByGenre) {
              favoriteGenres[genre] = (
                ratingsByGenre[genre].reduce((val, acc) => acc + val) /
                ratingsByGenre[genre].length
              ).toFixed(2);
            }

            for (const decade in ratingsByDecade) {
              avgRatingsByDecade[decade] = (
                ratingsByDecade[decade].reduce((val, acc) => acc + val) /
                ratingsByDecade[decade].length
              ).toFixed(2);
            }

            const sortedFavoriteGenres = Object.entries(favoriteGenres)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));

            const sortedAvgRatingsByDecade = Object.entries(
              avgRatingsByDecade
            ).sort((a, b) => a[0].localeCompare(b[0]));

            res.send({
              totalRatings: userMovieRatings.length,
              avgRating: (avgRating / userMovieRatings.length).toFixed(2),
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
