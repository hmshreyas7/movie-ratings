import React from 'react';
import Avatar from './Avatar';
import Home from './Home';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';

function SideNav() {
  return (
    <div className='side-nav-drawer'>
      <Home />
      <Avatar />
      <SearchBar />
      <NavLinks />
    </div>
  );
}

export default SideNav;
