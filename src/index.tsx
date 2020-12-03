import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import firebase from 'firebase/app';

let firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
