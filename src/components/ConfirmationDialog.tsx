import axios from 'axios';
import React from 'react';
import { Button, Dialog, DialogTitle } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../rootState';
import { updateRating } from '../actions';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  movieInfo: MovieRatingInfo;
}

function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { isOpen, onClose, movieInfo } = props;
  const user = useSelector((state: RootState) => state.user);

  let dispatch = useDispatch();

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/delete-rating/${user.uid}/${movieInfo.id}`)
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
        <Button className='confirmation-button' onClick={handleDelete}>
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
