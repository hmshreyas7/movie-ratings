import React, { ChangeEvent, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../actions';

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

  useEffect(() => {
    let unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(login(user));
        history.push('/');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, history]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setLoginInfo((prevInfo) => {
      return {
        ...prevInfo,
        [name]: value,
      };
    });
  };

  const emailSignIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(loginInfo.email, loginInfo.password);

    setLoginInfo({
      email: '',
      password: '',
    });
  };

  const goToSignUp = () => {
    history.push('/signup');
  };

  return (
    <div className='login-page-wrapper'>
      <div className='login-options-wrapper'>
        <div className='social-login-wrapper'>
          <button className='google-signin-button' onClick={googleSignIn}>
            Sign in with Google
          </button>
          <button className='facebook-signin-button' onClick={facebookSignIn}>
            Sign in with Facebook
          </button>
        </div>
        <div className='standard-login-wrapper'>
          <input
            type='email'
            placeholder='Email'
            name='email'
            value={loginInfo.email}
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={loginInfo.password}
            onChange={handleChange}
          />
          <div className='standard-login-buttons-wrapper'>
            <input type='submit' value='Login' onClick={emailSignIn} />
            <input type='button' value='Sign Up' onClick={goToSignUp} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
