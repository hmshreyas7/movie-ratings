import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MovieGrid from './components/MovieGrid';
import SideNav from './components/SideNav';

function App() {
  return (
    <>
      <SideNav />
      <Switch>
        <Route path='/login'>
          <LoginPage />
        </Route>
        <Route path='/'>
          <MovieGrid />
        </Route>
      </Switch>
    </>
  );
}

export default App;
