import { Grade } from '@material-ui/icons';
import React from 'react';

interface RatingCardProps {
  movieInfo: MovieRatingInfo;
}

function RatingCard(props: RatingCardProps) {
  return (
    <div className='movie-card-wrapper'>
      <div className='movie-card-poster'>
        <img src={props.movieInfo.poster} alt={props.movieInfo.title} />
      </div>
      <div className='movie-card-info'>
        <p>{props.movieInfo.title}</p>
        <div className='movie-card-rating'>
          <Grade fontSize='small' />
          <p>{props.movieInfo.rating}</p>
        </div>
      </div>
    </div>
  );
}

export default RatingCard;
