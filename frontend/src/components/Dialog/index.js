import React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export default function ConfirmDialog({
  open,
  handleClose,
  title,
  description,
  handleConfirm,
  titleCancel,
  titleConfirm,
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleClose}
          color="error"
          sx={{
            color: 'white',
          }}
        >
          {titleCancel}
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          color="success"
          sx={{
            color: 'white',
          }}
        >
          {titleConfirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
