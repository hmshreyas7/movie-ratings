import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleActionConfirmation } from '../actions';
import { RootState } from '../rootState';

function ActionConfirmation() {
  const actionConfirmation = useSelector(
    (state: RootState) => state.actionConfirmation
  );
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(
      toggleActionConfirmation({
        ...actionConfirmation,
        isOpen: false,
      })
    );
  };

  return (
    <Snackbar
      open={actionConfirmation.isOpen}
      autoHideDuration={2000}
      onClose={handleClose}
    >
      <Alert
        severity={actionConfirmation.status}
        variant='filled'
        elevation={6}
      >
        {actionConfirmation.message}
      </Alert>
    </Snackbar>
  );
}

export default ActionConfirmation;
