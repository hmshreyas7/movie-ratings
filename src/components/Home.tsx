import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className='home-wrapper'>
      <Link to='/'>
        <h2>
          m<span>o</span>vi<span>e</span> ra<span>t</span>in<span>g</span>s
        </h2>
      </Link>
    </div>
  );
}

export default Home;
