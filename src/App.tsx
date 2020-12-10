import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MovieGrid from './components/MovieGrid';
import SearchPage from './components/SearchPage';
import SideNav from './components/SideNav';
import SignUpPage from './components/SignUpPage';

function App() {
  return (
    <>
      <SideNav />
      <Switch>
        <Route path='/login'>
          <LoginPage />
        </Route>
        <Route path='/signup'>
          <SignUpPage />
        </Route>
        <Route path='/search'>
          <SearchPage />
        </Route>
        <Route path='/'>
          <MovieGrid />
        </Route>
      </Switch>
    </>
  );
}

export default App;
