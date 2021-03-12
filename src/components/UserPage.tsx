import Avatar from './Avatar';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../rootState';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { loading } from '../actions';
import NoData from './NoData';

function UserPage() {
  const user = useSelector((state: RootState) => state.user);
  let isLoading = useSelector((state: RootState) => state.isLoading);
  const creationTime = user.metadata ? user.metadata.creationTime : null;
  const joinDateTime = creationTime
    ? new Date(creationTime).toLocaleDateString()
    : '';
  let [watchStats, setWatchStats] = useState({
    hoursWatched: 0,
    favoriteGenres: [],
    favoriteDecade: '',
    topRatedMovies: [],
  });
  let history = useHistory();
  let dispatch = useDispatch();

  useEffect(() => {
    if (user.uid) {
      axios
        .get(`/api/watchstats/${user.uid}`)
        .then((res) => {
          setWatchStats({
            hoursWatched: res.data.hoursWatched,
            favoriteGenres: res.data.favoriteGenres,
            favoriteDecade: res.data.favoriteDecade,
            topRatedMovies: res.data.topRatedMovies,
          });
          dispatch(loading(false));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      dispatch(loading(false));
    }

    return () => {
      dispatch(loading(true));
    };
  }, [user.uid, dispatch]);

  const goToRatingPage = () => {
    history.push('/ratings');
  };

  const goToWatchNextPage = () => {
    history.push('/watch-next-movies');
  };

  if (user.uid) {
    return (
      <div className='user-page-wrapper'>
        {isLoading && (
          <div className='loading-indicator'>
            <CircularProgress color='inherit' />
          </div>
        )}
        <div className='user-page-profile'>
          <div className='user-page-avatar'>
            <Avatar />
          </div>
          <div className='user-page-info'>
            <h1>{user.displayName}</h1>
            <p>Joined: {joinDateTime}</p>
          </div>
        </div>
        <div className='user-page-watchstats'>
          <div className='watchstats-main-wrapper'>
            <div className='watchstats-item'>
              <p>Watch time</p>
              <p>{watchStats.hoursWatched} hours</p>
            </div>
            <div className='watchstats-item'>
              <p>Favorite genres</p>
              <p>
                {watchStats.favoriteGenres.map((genre) => genre[0]).join(', ')}
              </p>
            </div>
            <div className='watchstats-item'>
              <p>Favorite decade</p>
              <p>{watchStats.favoriteDecade}</p>
            </div>
          </div>
          <div className='watchstats-item'>
            <p>Top-rated movies</p>
            <div className='top-rated-movie-card-wrapper'>
              {watchStats.topRatedMovies
                .sort((a: any, b: any) => a.title.localeCompare(b.title))
                .sort((a: any, b: any) => b.rating - a.rating)
                .map((movie: any) => (
                  <div key={movie.id} className='top-rated-movie-card'>
                    <img src={movie.poster} alt={movie.title} />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className='user-page-options'>
          <div className='options-button' onClick={goToRatingPage}>
            Rating History
          </div>
          <div className='options-button' onClick={goToWatchNextPage}>
            Watch Next
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='user-page-wrapper'>
        <NoData />
      </div>
    );
  }
}

export default UserPage;
