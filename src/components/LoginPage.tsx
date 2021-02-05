import React, { ChangeEvent, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loading, login } from '../actions';
import axios from 'axios';
import { RootState } from '../rootState';
import { CircularProgress } from '@material-ui/core';

function googleSignIn() {
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

function facebookSignIn() {
  let provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

function LoginPage() {
  let history = useHistory();
  let dispatch = useDispatch();
  let [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });
  let [errorMessage, setErrorMessage] = useState('');
  let isLoading = useSelector((state: RootState) => state.isLoading);

  useEffect(() => {
    let unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(login(user));
        history.push('/');

        axios
          .post('http://localhost:5000/login', {
            _id: user.uid,
            name: user.displayName,
            email: user.email,
            birthday: '',
            joinDateTime: user.metadata.creationTime,
            lastSignInDateTime: user.metadata.lastSignInTime,
          })
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        dispatch(loading(false));
      }
    });

    return () => {
      unsubscribe();
      dispatch(loading(true));
    };
  }, [dispatch, history]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setErrorMessage('');

    setLoginInfo((prevInfo) => {
      return {
        ...prevInfo,
        [name]: value,
      };
    });
  };

  const emailSignIn = (event: any) => {
    event.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(loginInfo.email, loginInfo.password)
      .then(() => {
        setLoginInfo({
          email: '',
          password: '',
        });
        setErrorMessage('');
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  const goToSignUp = () => {
    history.push('/signup');
  };

  return (
    <div className='login-page-wrapper'>
      {isLoading && (
        <div className='loading-indicator'>
          <CircularProgress color='inherit' />
        </div>
      )}
      <div className='login-options-wrapper'>
        <div className='social-login-wrapper'>
          <button className='google-signin-button' onClick={googleSignIn}>
            Sign in with Google
          </button>
          <button className='facebook-signin-button' onClick={facebookSignIn}>
            Sign in with Facebook
          </button>
        </div>
        <form className='standard-login-wrapper' onSubmit={emailSignIn}>
          <input
            type='email'
            placeholder='Email'
            name='email'
            value={loginInfo.email}
            onChange={handleChange}
            required
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={loginInfo.password}
            onChange={handleChange}
            required
          />
          <div className='standard-login-buttons-wrapper'>
            <input type='submit' value='Login' />
            <input type='button' value='Sign Up' onClick={goToSignUp} />
          </div>
          {errorMessage && <p>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
