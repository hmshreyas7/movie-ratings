import React, { useEffect, useRef, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../rootState';
import { CircularProgress } from '@material-ui/core';
import { loading } from '../actions';
import NoData from './NoData';

function SettingsPage() {
  const user = useSelector((state: RootState) => state.user);
  const isLoading = useSelector((state: RootState) => state.isLoading);
  let [profilePhoto, setProfilePhoto] = useState<File>();
  let storageRef = firebase.storage().ref();
  let profilePhotoRef = storageRef.child(`${user.uid}/profile_photo.png`);
  let dispatch = useDispatch();
  let fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(loading(false));

    return () => {
      dispatch(loading(true));
    };
  }, [dispatch]);

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
      })
      .catch((err) => {
        console.log(err);
        console.log('Delete error!');
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
