import axios from 'axios';
import React from 'react';
import { Button, Dialog, DialogTitle } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../rootState';
import { toggleWatchNext, updateRating } from '../actions';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  movieInfo: OMDbMovie | MovieRatingInfo;
}

function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { isOpen, onClose, movieInfo } = props;
  const user = useSelector((state: RootState) => state.user);
  const movieID = 'imdbID' in movieInfo ? movieInfo.imdbID : movieInfo.id;

  let dispatch = useDispatch();

  const handleRemove = () => {
    axios
      .delete(`/delete-watch-next/${user.uid}/${movieID}`)
      .then((res) => {
        console.log(res.data);
        dispatch(toggleWatchNext());
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = () => {
    axios
      .delete(`/delete-rating/${user.uid}/${movieID}`)
      .then((res) => {
        console.log(res.data);
        dispatch(updateRating(true));
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Dialog className='confirmation-dialog' onClose={onClose} open={isOpen}>
      <DialogTitle id='simple-dialog-title'>Are you sure?</DialogTitle>
      <div className='confirmation-button-wrapper'>
        <Button
          className='confirmation-button'
          onClick={'imdbID' in movieInfo ? handleRemove : handleDelete}
        >
          Yes
        </Button>
        <Button className='confirmation-button' onClick={onClose}>
          No
        </Button>
      </div>
    </Dialog>
  );
}

export default ConfirmationDialog;
