import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MovieGrid from './components/MovieGrid';
import MoviePage from './components/MoviePage';
import RatingPage from './components/RatingPage';
import RatingStatsPage from './components/RatingStatsPage';
import SettingsPage from './components/SettingsPage';
import SideNav from './components/SideNav';
import SignUpPage from './components/SignUpPage';
import TrendingPage from './components/TrendingPage';
import UserPage from './components/UserPage';

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
          <MovieGrid isSearch={true} />
        </Route>
        <Route path='/settings'>
          <SettingsPage />
        </Route>
        <Route path='/trending'>
          <TrendingPage />
        </Route>
        <Route path='/movie/:id'>
          <MoviePage />
        </Route>
        <Route path='/user'>
          <UserPage />
        </Route>
        <Route path='/ratings'>
          <RatingPage />
        </Route>
        <Route path='/rating-stats'>
          <RatingStatsPage />
        </Route>
        <Route path='/'>
          <MovieGrid />
        </Route>
      </Switch>
    </>
  );
}

export default App;
