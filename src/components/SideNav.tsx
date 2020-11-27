import React from 'react';
import Avatar from './Avatar';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';

function SideNav() {
  return (
    <div className='side-nav-drawer'>
      <Avatar />
      <SearchBar />
      <NavLinks />
    </div>
  );
}

export default SideNav;
