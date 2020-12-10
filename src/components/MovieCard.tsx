import React from 'react';

interface MovieCardProps {
  title: string;
  rating: string;
  poster: string;
}

function MovieCard(props: MovieCardProps) {
  return (
    <div className='movie-card-wrapper'>
      <div className='movie-card-poster'>
        <img src={props.poster} alt={props.title} />
        <div className='movie-card-overlay'>
          <button>Add</button>
        </div>
      </div>
      <div className='movie-card-info'>
        <p>{props.title}</p>
        <p>{props.rating}</p>
      </div>
    </div>
  );
}

export default MovieCard;
