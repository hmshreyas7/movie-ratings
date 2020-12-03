import React from 'react';
import Avatar from './Avatar';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';

interface SideNavProps {
  userPhoto: string;
  userName: string;
}

function SideNav(props: SideNavProps) {
  return (
    <div className='side-nav-drawer'>
      <Avatar userPhoto={props.userPhoto} userName={props.userName} />
      <SearchBar />
      <NavLinks />
    </div>
  );
}

export default SideNav;
