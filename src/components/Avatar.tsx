import React from 'react';
import { useSelector } from 'react-redux';
import defaultAvatar from '../assets/default-user-avatar.png';
import firebase from 'firebase/app';
import dotenv from 'dotenv';

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

  return (
    <div className='avatar-wrapper'>
      <img
        src={user.photoURL ? setAvatarImage(user.photoURL) : defaultAvatar}
        alt='Avatar'
      />
      <p>{user.displayName ? user.displayName : 'Guest'}</p>
    </div>
  );
}

export default Avatar;
