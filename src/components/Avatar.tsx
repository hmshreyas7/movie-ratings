import React from 'react';
import defaultAvatar from '../assets/default-user-avatar.png';

interface AvatarProps {
  userPhoto: string;
  userName: string;
}

function Avatar(props: AvatarProps) {
  return (
    <div className='avatar-wrapper'>
      <img
        src={props.userPhoto ? props.userPhoto : defaultAvatar}
        alt='Avatar'
      />
      <p>{props.userName ? props.userName : 'Guest'}</p>
    </div>
  );
}

export default Avatar;
