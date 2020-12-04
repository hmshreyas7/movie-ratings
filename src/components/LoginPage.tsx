import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useHistory } from 'react-router-dom';

function googleSignIn() {
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

function facebookSignIn() {
  let provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

interface LoginPageProps {
  onLogin: Function;
}

function LoginPage(props: LoginPageProps) {
  let history = useHistory();

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      props.onLogin(user);
      history.push('/');
    }
  });

  return (
    <div className='login-wrapper'>
      <button onClick={googleSignIn}>Sign in with Google</button>
      <button onClick={facebookSignIn}>Sign in with Facebook</button>
    </div>
  );
}

export default LoginPage;
