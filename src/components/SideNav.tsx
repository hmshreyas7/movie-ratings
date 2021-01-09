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
  let [menuHeight, setMenuHeight] = useState(menu.current?.offsetHeight);

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
    const loadingIndicator = document.querySelector(
      '.loading-indicator div'
    ) as HTMLElement;

    if (mediaQueryMatch && loadingIndicator && isLoading && menuHeight) {
      loadingIndicator.style.position = 'absolute';
      loadingIndicator.style.top = `calc(0.5 * (100% + ${menuHeight.toString()}px))`;
      loadingIndicator.style.transition = 'top 0.3s';
    }
  }, [mediaQueryMatch, isLoading, menuHeight]);

  const handleMenuToggle = () => {
    mediaQueryMatch && setExpanded((prevValue) => !prevValue);
  };

  const handleMenuClose = (e: MouseEvent) => {
    if (!menu.current?.contains(e.target as Node)) {
      setExpanded(false);
    }
  };

  const handleTransitionEnd = () => {
    mediaQueryMatch && setMenuHeight(menu.current?.offsetHeight);
  };

  return (
    <div className='side-nav-drawer' ref={menu}>
      <div className='side-nav-logo-toggle-wrapper'>
        <Home
          onMenuToggle={() => {
            mediaQueryMatch && setExpanded(false);
          }}
        />
        {mediaQueryMatch && (
          <div className='side-nav-toggle' onClick={handleMenuToggle}>
            {isExpanded ? <ArrowDropUp /> : <ArrowDropDown />}
          </div>
        )}
      </div>
      <div
        className={isExpanded ? 'side-nav-expanded' : 'side-nav-collapsed'}
        onTransitionEnd={handleTransitionEnd}
      >
        <Avatar onMenuToggle={handleMenuToggle} />
        <SearchBar onMenuToggle={handleMenuToggle} />
        <NavLinks onMenuToggle={handleMenuToggle} />
      </div>
    </div>
  );
}

export default SideNav;
