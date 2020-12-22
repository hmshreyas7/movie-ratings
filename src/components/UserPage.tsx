import Avatar from './Avatar';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../rootState';
import axios from 'axios';

function UserPage() {
  const user = useSelector((state: RootState) => state.user);
  const creationTime = user.metadata ? user.metadata.creationTime : null;
  const joinDateTime = creationTime
    ? new Date(creationTime).toLocaleDateString()
    : '';
  let [watchStats, setWatchStats] = useState({
    hoursWatched: 0,
    favoriteGenres: [],
    favoriteDecades: [],
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/watchstats/${user.uid}`)
      .then((res) => {
        setWatchStats({
          hoursWatched: res.data.hoursWatched,
          favoriteGenres: res.data.favoriteGenres,
          favoriteDecades: res.data.favoriteDecades,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.uid]);

  return (
    <div className='user-page-wrapper'>
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
    </div>
  );
}

export default UserPage;
