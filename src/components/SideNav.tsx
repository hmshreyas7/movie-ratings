import { useMediaQuery } from '@material-ui/core';
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../rootState';
import Avatar from './Avatar';
import Home from './Home';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';

function SideNav() {
  const mediaQueryMatch = useMediaQuery('(max-width: 600px)');
  let [isExpanded, setExpanded] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const isLoading = useSelector((state: RootState) => state.isLoading);

  useEffect(() => {
    setExpanded(!mediaQueryMatch);
    mediaQueryMatch &&
      document.addEventListener('click', handleMenuClose, { capture: true });

    return () => {
      mediaQueryMatch &&
        document.removeEventListener('click', handleMenuClose, {
          capture: true,
        });
    };
  }, [mediaQueryMatch]);

  useEffect(() => {
    if (mediaQueryMatch && isLoading && menu.current) {
      (document.querySelector(
        '.loading-indicator'
      ) as HTMLElement).style.top = `${menu.current.offsetHeight.toString()}px`;
    }
  }, [mediaQueryMatch, isLoading]);

  const handleMenuToggle = () => {
    setExpanded((prevValue) => !prevValue);
  };

  const handleMenuClose = (e: MouseEvent) => {
    if (!menu.current?.contains(e.target as Node)) {
      setExpanded(false);
    }
  };

  return (
    <div className='side-nav-drawer' ref={menu}>
      <div className='side-nav-logo-toggle-wrapper'>
        <Home />
        {mediaQueryMatch && (
          <div className='side-nav-toggle' onClick={handleMenuToggle}>
            {isExpanded ? <ArrowDropUp /> : <ArrowDropDown />}
          </div>
        )}
      </div>
      <div className={isExpanded ? 'side-nav-expanded' : 'side-nav-collapsed'}>
        <Avatar />
        <SearchBar />
        <NavLinks />
      </div>
    </div>
  );
}

export default SideNav;
