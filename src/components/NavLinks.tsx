import React from 'react';
import { Link } from 'react-router-dom';

function NavLinks() {
  return (
    <ul className='nav-links-list'>
      <li>
        <Link to='/login'>Login</Link>
      </li>
      <li>Settings</li>
    </ul>
  );
}

export default NavLinks;
