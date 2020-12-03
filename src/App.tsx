import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MovieGrid from './components/MovieGrid';
import SideNav from './components/SideNav';
import firebase from 'firebase/app';

function App() {
  let [user, setUser] = useState(Object);

  function handleLogin(user: firebase.User) {
    setUser(user);
  }

  return (
    <>
      <SideNav userPhoto={user.photoURL} userName={user.displayName} />
      <Switch>
        <Route path='/login'>
          <LoginPage onLogin={handleLogin} />
        </Route>
        <Route path='/'>
          <MovieGrid />
        </Route>
      </Switch>
    </>
  );
}

export default App;
