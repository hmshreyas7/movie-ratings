import React, { useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

function NavLinks() {
  const [isSelected, setSelected] = useState(false);
  const match = useRouteMatch('/(login|settings)');

  useEffect(() => {
    if (match?.isExact) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [match]);

  return (
    <ul className='nav-links-list'>
      <li>
        <Link
          className='nav-link'
          style={{ color: isSelected ? '#EF564D' : '' }}
          to='/login'
        >
          Login
        </Link>
      </li>
      <li>Settings</li>
    </ul>
  );
}

export default NavLinks;
