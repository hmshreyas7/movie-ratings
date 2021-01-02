import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import defaultAvatar from '../assets/default-user-avatar.png';
import firebase from 'firebase/app';
import dotenv from 'dotenv';
import { useHistory } from 'react-router-dom';
import { login } from '../actions';

interface RootState {
  user: firebase.User;
}

function setAvatarImage(photoURL: string) {
  if (photoURL.includes('graph.facebook.com')) {
    dotenv.config();
    const accessToken = process.env.REACT_APP_FACEBOOK_ACCESS_TOKEN;
    return photoURL + `?access_token=${accessToken}`;
  } else {
    return photoURL;
  }
}

function Avatar() {
  const user = useSelector((state: RootState) => state.user);
  let history = useHistory();
  let dispatch = useDispatch();

  useEffect(() => {
    let unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(login(user));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  const handleClick = () => {
    if (user.displayName) {
      history.push('/user');
    }
  };

  return (
    <div className='avatar-wrapper'>
      <img
        src={user.photoURL ? setAvatarImage(user.photoURL) : defaultAvatar}
        alt='Avatar'
      />
      <p
        onClick={handleClick}
        style={user.displayName ? { cursor: 'pointer' } : {}}
      >
        {user.displayName ? user.displayName : 'Guest'}
      </p>
    </div>
  );
}

export default Avatar;
