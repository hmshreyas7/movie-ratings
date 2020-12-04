import React from 'react';
import { useSelector } from 'react-redux';
import defaultAvatar from '../assets/default-user-avatar.png';
import firebase from 'firebase/app';

interface RootState {
  user: firebase.User;
}

function Avatar() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className='avatar-wrapper'>
      <img src={user.photoURL ? user.photoURL : defaultAvatar} alt='Avatar' />
      <p>{user.displayName ? user.displayName : 'Guest'}</p>
    </div>
  );
}

export default Avatar;
