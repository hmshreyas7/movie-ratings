import React, { useEffect, useRef, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../rootState';
import { CircularProgress } from '@material-ui/core';
import { loading, updateProfilePhoto } from '../actions';
import NoData from './NoData';
import axios from 'axios';

function SettingsPage() {
  const user = useSelector((state: RootState) => state.user);
  const isLoading = useSelector((state: RootState) => state.isLoading);
  let [profilePhoto, setProfilePhoto] = useState<File>();
  let [profileInfo, setProfileInfo] = useState({
    email: '',
    birthday: '',
  });
  let storageRef = firebase.storage().ref();
  let profilePhotoRef = storageRef.child(`${user.uid}/profile_photo.png`);
  let dispatch = useDispatch();
  let fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/profile-info/${user.uid}`)
      .then((res) => {
        setProfileInfo(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(loading(false));
      });

    return () => {
      dispatch(loading(true));
    };
  }, [dispatch, user.uid]);

  const handleChange = (event: any) => {
    setProfilePhoto(event.target.files[0]);
  };

  const handleUpload = (event: any) => {
    event.preventDefault();

    if (profilePhoto) {
      dispatch(loading(true));

      profilePhotoRef
        .put(profilePhoto)
        .then(() => {
          console.log('Upload success!');
          setProfilePhoto(undefined);
          dispatch(updateProfilePhoto());

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        })
        .catch(() => {
          console.log('Upload error!');
        })
        .finally(() => {
          dispatch(loading(false));
        });
    }
  };

  const handleDelete = () => {
    dispatch(loading(true));

    profilePhotoRef
      .delete()
      .then(() => {
        console.log('Delete success!');
        dispatch(updateProfilePhoto());
      })
      .catch((err) => {
        console.log(err);
        console.log('Delete error!');
      })
      .finally(() => {
        dispatch(loading(false));
      });
  };

  const handleProfileInfoChange = (event: any) => {
    const { name, value } = event.target;

    setProfileInfo((prevProfileInfo) => {
      return {
        ...prevProfileInfo,
        [name]: value,
      };
    });
  };

  const handleSave = () => {
    dispatch(loading(true));

    axios
      .post('http://localhost:5000/profile-info', {
        userID: user.uid,
        email: profileInfo.email,
        birthday: profileInfo.birthday,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(loading(false));
      });
  };

  if (user.uid) {
    return (
      <div className='settings-page-wrapper'>
        {isLoading && (
          <div className='loading-indicator'>
            <CircularProgress color='inherit' />
          </div>
        )}
        Change profile photo
        <form>
          <input
            type='file'
            accept='image/*'
            ref={fileInputRef}
            onChange={handleChange}
          />
          <input type='submit' value='Upload' onClick={handleUpload} />
        </form>
        <button onClick={handleDelete}>Delete</button>
        E-mail address
        <input
          type='email'
          value={profileInfo.email}
          name='email'
          onChange={handleProfileInfoChange}
        />
        Birthday
        <input
          type='date'
          value={profileInfo.birthday}
          name='birthday'
          onChange={handleProfileInfoChange}
        />
        <button onClick={handleSave}>Save</button>
      </div>
    );
  } else {
    return (
      <div className='settings-page-wrapper'>
        <NoData />
      </div>
    );
  }
}

export default SettingsPage;
