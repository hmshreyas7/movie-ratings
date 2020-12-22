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
      ).then((response) => {
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
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
