import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import defaultAvatar from '../assets/default-user-avatar.png';
import firebase from 'firebase/app';
import 'firebase/storage';
import { useHistory } from 'react-router-dom';
import { login } from '../actions';
import axios from 'axios';
import { RootState } from '../rootState';

interface AvatarProps {
  onMenuToggle?: () => void;
}

function Avatar(props: AvatarProps) {
  const user = useSelector((state: RootState) => state.user);
  const isProfilePhotoUpdated = useSelector(
    (state: RootState) => state.isProfilePhotoUpdated
  );
  let history = useHistory();
  let dispatch = useDispatch();
  let [profilePhotoURL, setProfilePhotoURL] = useState();

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
    if (user.uid) {
      const storageRef = firebase.storage().ref();
      const profilePhotoRef = storageRef.child(`${user.uid}/profile_photo.png`);

      profilePhotoRef
        .getDownloadURL()
        .then((url) => {
          setProfilePhotoURL(url);
        })
        .catch(() => {
          if (user.photoURL?.includes('graph.facebook.com')) {
            axios
              .get(`/facebook-photo?photoURL=${user.photoURL}`)
              .then((res) => {
                setProfilePhotoURL(res.data);
              })
              .catch((err) => {
                console.log(err.response.data);
              });
          } else {
            setProfilePhotoURL(undefined);
          }
        });
    } else {
      setProfilePhotoURL(undefined);
    }
  }, [user.photoURL, user.uid, isProfilePhotoUpdated]);

  const setAvatarImage = () => {
    const photoURL = user.photoURL;

    if (!photoURL) {
      return defaultAvatar;
    }

    return photoURL;
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
