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
    favoriteDecades: [],
  });
  let history = useHistory();
  let dispatch = useDispatch();

  useEffect(() => {
    if (user.uid) {
      axios
        .get(`http://localhost:5000/watchstats/${user.uid}`)
        .then((res) => {
          setWatchStats({
            hoursWatched: res.data.hoursWatched,
            favoriteGenres: res.data.favoriteGenres,
            favoriteDecades: res.data.favoriteDecades,
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
          <p>Hours watched: {watchStats.hoursWatched}</p>
          <p>
            Favorite genres:{' '}
            {watchStats.favoriteGenres.map((genre) => genre[0]).join(', ')}
          </p>
          <p>
            Favorite decades:{' '}
            {watchStats.favoriteDecades.map((decade) => decade[0]).join(', ')}
          </p>
        </div>
        <div className='rating-history-button' onClick={goToRatingPage}>
          Rating History
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
