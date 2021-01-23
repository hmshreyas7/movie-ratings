import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import defaultAvatar from '../assets/default-user-avatar.png';
import firebase from 'firebase/app';
import 'firebase/storage';
import dotenv from 'dotenv';
import { useHistory } from 'react-router-dom';
import { login } from '../actions';

interface RootState {
  user: firebase.User;
}

interface AvatarProps {
  onMenuToggle?: () => void;
}

function Avatar(props: AvatarProps) {
  const user = useSelector((state: RootState) => state.user);
  let history = useHistory();
  let dispatch = useDispatch();
  let [profilePhotoURL, setProfilePhotoURL] = useState();
  let storageRef = firebase.storage().ref();

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

  useEffect(() => {
    let profilePhotoRef = storageRef.child(`${user.uid}/profile_photo.png`);
    profilePhotoRef
      .getDownloadURL()
      .then((url) => {
        setProfilePhotoURL(url);
      })
      .catch(() => {
        setProfilePhotoURL(undefined);
      });
  }, [storageRef, user.uid]);

  const setAvatarImage = () => {
    const photoURL = user.photoURL;

    if (!photoURL) {
      return defaultAvatar;
    }

    if (photoURL.includes('graph.facebook.com')) {
      dotenv.config();
      const accessToken = process.env.REACT_APP_FACEBOOK_ACCESS_TOKEN;
      return photoURL + `?access_token=${accessToken}`;
    } else {
      return photoURL;
    }
  };

  const handleMenuToggle = props.onMenuToggle;

  const handleClick = () => {
    if (user.displayName) {
      handleMenuToggle && handleMenuToggle();
      history.push('/user');
    }
  };

  return (
    <div className='avatar-wrapper'>
      <div className='avatar-image-wrapper'>
        <img
          src={profilePhotoURL ? profilePhotoURL : setAvatarImage()}
          alt='Avatar'
        />
      </div>
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
