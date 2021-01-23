import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useRouteMatch } from 'react-router-dom';
import firebase from 'firebase/app';
import { logout } from '../actions';

interface RootState {
  user: firebase.User;
}

interface NavLinksProps {
  onMenuToggle: () => void;
}

function NavLinks(props: NavLinksProps) {
  const match = useRouteMatch('/(login|settings)');
  let user = useSelector((state: RootState) => state.user);
  let dispatch = useDispatch();

  const handleMenuToggle = props.onMenuToggle;

  const handleLogout = () => {
    firebase.auth().signOut();
    dispatch(logout());
  };

  return (
    <ul className='nav-links-list'>
      <li onClick={handleMenuToggle}>
        {!user.uid ? (
          <Link
            className='nav-link'
            style={{ color: match?.url === '/login' ? '#EF564D' : '' }}
            to='/login'
          >
            Login
          </Link>
        ) : (
          <span className='logout' onClick={handleLogout}>
            Logout
          </span>
        )}
      </li>
      <li>
        <Link
          className='nav-link'
          style={{ color: match?.url === '/settings' ? '#EF564D' : '' }}
          to={user.uid ? '/settings' : '/login'}
        >
          Settings
        </Link>
      </li>
    </ul>
  );
}

export default NavLinks;
