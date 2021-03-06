import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { search } from '../actions';

interface SearchBarProps {
  onMenuToggle: () => void;
}

function SearchBar(props: SearchBarProps) {
  let history = useHistory();
  let dispatch = useDispatch();
  let [searchInput, setSearchInput] = useState('');
  let match = useRouteMatch('/search');

  const handleMenuToggle = props.onMenuToggle;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let input = event.target.value;
    setSearchInput(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    let query = searchInput.trim();

    if (query !== '' && event.key === 'Enter') {
      handleMenuToggle();
      if (!match?.isExact) {
        history.push('/search');
      }
      dispatch(search(query));
      setSearchInput('');
    }
  };

  return (
    <input
      className='search-bar-input'
      type='text'
      placeholder='Search'
      value={searchInput}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}

export default SearchBar;
