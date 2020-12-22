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

const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  joinDateTime: String,
  lastSignInDateTime: String,
});

const User = mongoose.model('User', userSchema);

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
        });
        loggedInUser.save();
      }
    })
    .catch((err) => {
      console.log(err);
    });

  res.send('User login success');
});

app.post('/rate', (req, res) => {
  console.log(req.body);
  res.send('Rating received');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
