import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useHistory } from 'react-router-dom';

function googleSignIn() {
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

function LoginPage() {
  let firebaseConfig = {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  };
  firebase.initializeApp(firebaseConfig);

  let history = useHistory();

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      history.push('/');
    }
  });

  return (
    <div className='login-wrapper'>
      <button onClick={googleSignIn}>Sign in with Google</button>
    </div>
  );
}

export default LoginPage;
