import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../rootState';
import { ErrorOutline } from '@material-ui/icons';
import { toggleActionConfirmation, updateRating } from '../actions';

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  movieInfo: OMDbMovie | MovieRatingInfo;
}

function RatingDialog(props: RatingDialogProps) {
  const { isOpen, onClose, movieInfo } = props;
  const movieTitle = 'imdbID' in movieInfo ? movieInfo.Title : movieInfo.title;
  let [rating, setRating] = useState(
    'imdbID' in movieInfo ? 0 : movieInfo.rating
  );
  let [ratingHover, setRatingHover] = useState(-1);
  let [isRatingError, setRatingError] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  let dispatch = useDispatch();

  useEffect(() => {
    return () => {
      if (!isOpen) {
        setRating('imdbID' in movieInfo ? 0 : movieInfo.rating);
        setRatingHover(-1);
        setRatingError(false);
      }
    };
  }, [movieInfo, isOpen]);

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

  const handleRatingHoverChange = (
    event: ChangeEvent<{}>,
    value: number | null
  ) => {
    if (value) {
      setRatingHover(value);
      setRatingError(false);
    }
  };

  const handleRatingChange = (event: ChangeEvent<{}>, value: number | null) => {
    if (value) {
      setRating(value);
    }
  };

  const handleRate = () => {
    if (rating === 0) {
      setRatingError(true);
    } else {
      axios
        .post('/api/rate', {
          userID: user.uid,
          movie: movieInfo,
          rating: rating,
          timestamp: new Date().toString(),
        })
        .then((res) => {
          dispatch(updateRating(true));
          onClose();
          dispatch(
            toggleActionConfirmation({
              isOpen: true,
              status: 'success',
              message: res.data,
            })
          );

          if ('imdbID' in movieInfo && movieInfo.Timestamp) {
            axios
              .delete(`/api/delete-watch-next/${user.uid}/${movieInfo.imdbID}`)
              .then((res) => {
                console.log(res.data);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          dispatch(
            toggleActionConfirmation({
              isOpen: true,
              status: 'error',
              message: err,
            })
          );
        });
    }
  };

  return (
    <Dialog className='rating-dialog' onClose={onClose} open={isOpen}>
      <DialogTitle id='simple-dialog-title'>
        {`Select rating for "${movieTitle}"`}
      </DialogTitle>
      <div className='rating-hover'>
        <p>{hoverLabels[ratingHover === -1 ? rating : ratingHover]}</p>
        {isRatingError && (
          <div className='rating-error'>
            <ErrorOutline />
            No rating selected
          </div>
        )}
        <Rating
          value={rating}
          max={10}
          onChangeActive={handleRatingHoverChange}
          onChange={handleRatingChange}
        />
      </div>
      <Button className='rating-button' onClick={handleRate}>
        Rate
      </Button>
    </Dialog>
  );
}

export default RatingDialog;
