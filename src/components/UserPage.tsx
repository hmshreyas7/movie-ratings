import Avatar from './Avatar';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../rootState';

function UserPage() {
  const user = useSelector((state: RootState) => state.user);
  const creationTime = user.metadata ? user.metadata.creationTime : null;
  const joinDateTime = creationTime
    ? new Date(creationTime).toLocaleDateString()
    : '';

  return (
    <div className='user-page-wrapper'>
      <div className='user-page-profile'>
        <div className='user-page-avatar'>
          <Avatar />
        </div>
        <div className='user-page-info'>
          <h1>{user.displayName}</h1>
          <p>Joined: {joinDateTime}</p>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
