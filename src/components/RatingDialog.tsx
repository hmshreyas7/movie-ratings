import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { Button, Dialog, DialogTitle } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import { RootState } from '../rootState';

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  movieTitle: string;
  movieID: string;
}

function RatingDialog(props: RatingDialogProps) {
  const { isOpen, onClose, movieTitle, movieID } = props;
  let [rating, setRating] = useState(0);
  let [ratingHover, setRatingHover] = useState(-1);
  const user = useSelector((state: RootState) => state.user);

  const hoverLabels: Record<number, string> = {
    1: 'Appalling',
    2: 'Horrible',
    3: 'Very Bad',
    4: 'Bad',
    5: 'Average',
    6: 'Fine',
    7: 'Good',
    8: 'Very Good',
    9: 'Great',
    10: 'Masterpiece',
  };

  const handleClose = () => {
    onClose();
    setRating(0);
  };

  const handleRatingHoverChange = (
    event: ChangeEvent<{}>,
    value: number | null
  ) => {
    if (value) {
      setRatingHover(value);
    }
  };

  const handleRatingChange = (event: ChangeEvent<{}>, value: number | null) => {
    if (value) {
      setRating(value);
    }
  };

  const handleRate = () => {
    axios
      .post('http://localhost:5000/rate', {
        userID: user.uid,
        movieID: movieID,
        rating: rating,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    onClose();
    setRating(0);
  };

  return (
    <Dialog className='rating-dialog' onClose={handleClose} open={isOpen}>
      <DialogTitle id='simple-dialog-title'>
        {ratingHover === -1 && rating === 0
          ? `Select rating for "${movieTitle}"`
          : hoverLabels[ratingHover === -1 ? rating : ratingHover]}
      </DialogTitle>
      <Rating
        value={rating}
        max={10}
        onChangeActive={handleRatingHoverChange}
        onChange={handleRatingChange}
      />
      <Button className='rating-button' onClick={handleRate}>
        Rate
      </Button>
    </Dialog>
  );
}

export default RatingDialog;