import React from 'react';
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

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      dispatch(login(user));
      history.push('/');
    }
  });

  return (
    <div className='login-wrapper'>
      <div className='social-login-wrapper'>
        <button className='google-signin-button' onClick={googleSignIn}>
          Sign in with Google
        </button>
        <button className='facebook-signin-button' onClick={facebookSignIn}>
          Sign in with Facebook
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
