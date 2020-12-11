import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useRouteMatch } from 'react-router-dom';
import firebase from 'firebase/app';
import { logout } from '../actions';

interface RootState {
  user: firebase.User;
}

function NavLinks() {
  const [isSelected, setSelected] = useState(false);
  const match = useRouteMatch('/(login|settings)');
  let user = useSelector((state: RootState) => state.user);
  let dispatch = useDispatch();

  useEffect(() => {
    if (match?.isExact) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [match]);

  const handleLogout = () => {
    firebase.auth().signOut();
    dispatch(logout());
  };

  return (
    <ul className='nav-links-list'>
      <li>
        {!user.uid ? (
          <Link
            className='nav-link'
            style={{ color: isSelected ? '#EF564D' : '' }}
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
      <li>Settings</li>
    </ul>
  );
}

export default NavLinks;
