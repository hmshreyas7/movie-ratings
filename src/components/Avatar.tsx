import React from 'react';
import defaultAvatar from '../assets/default-user-avatar.png';

function Avatar() {
  return (
    <div className='avatar-wrapper'>
      <img src={defaultAvatar} alt='Guest avatar' />
      <p>Guest</p>
    </div>
  );
}

export default Avatar;
