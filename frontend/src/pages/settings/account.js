import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';

import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import FingerprintRoundedIcon from '@mui/icons-material/FingerprintRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

import { createAxios } from '../../createInstance';
import { deleteUser, updateUser } from '../../redux/apiRequest/userApi';
import { deleteUserSuccess, loginSuccess } from '../../redux/slice/userSlice';
import { useToastTheme } from '../../constants/constant';

export default function Account() {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toastTheme = useToastTheme();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;

  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address!')
      .max(50, 'Emails must be less than 50 characters!')
      .required('Email is required!'),
    nickname: Yup.string()
      .required('Nickname is required!')
      .min(5)
      .max(20, 'Nickname must be at least 20 characters!'),
  });

  const formik = useFormik({
    initialValues: {
      email: user?.email || '',
      nickname: user?.nickname || '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await updateUser(
        accessToken,
        dispatch,
        user?._id,
        axiosJWT,
        values,
        toastTheme,
      );
    },
  });

  const handleClickOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handelDeleteAccount = async (event) => {
    event.preventDefault();
    handleCloseConfirmDialog();
    let axiosJWTDelete = createAxios(user, dispatch, deleteUserSuccess);
    await deleteUser(
      accessToken,
      navigate,
      dispatch,
      user?._id,
      axiosJWTDelete,
      toastTheme,
    );
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={formik.handleSubmit}
      method="PUT"
    >
      <Typography variant="h5" fontWeight={700}>
        Account
      </Typography>
      <Box marginTop={4} display="flex" flexDirection="column">
        <TextField
          id="email"
          label="Email"
          variant="standard"
          required
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineRoundedIcon sx={{ fontSize: 16 }} />
              </InputAdornment>
            ),
          }}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <Typography
          variant="caption"
          marginBottom={2}
          fontStyle="italic"
          sx={{ marginTop: 1 }}
        >
          Email will not be displayed publicly !!!
        </Typography>
        <TextField
          id="nickname"
          label="Nickname"
          variant="standard"
          required
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FingerprintRoundedIcon sx={{ fontSize: 16 }} />
              </InputAdornment>
            ),
          }}
          value={formik.values.nickname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nickname && Boolean(formik.errors.nickname)}
          helperText={formik.touched.nickname && formik.errors.nickname}
        />
        <Typography
          variant="caption"
          marginBottom={1}
          fontStyle="italic"
          sx={{ marginTop: 1 }}
        >
          The link to your profile looks like this:{' '}
          {process.env.REACT_APP_DOMAIN}/u/{formik.values.nickname}
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          marginTop={5}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={!formik.dirty || formik.isSubmitting || !formik.isValid}
          >
            Save
          </Button>
          <Link onClick={handleClickOpenConfirmDialog}>Delete account?</Link>
          <Dialog
            open={openConfirmDialog}
            onClose={handleCloseConfirmDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle
              id="alert-dialog-title"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <WarningAmberRoundedIcon
                color="warning"
                sx={{ marginRight: 1 }}
              />
              Confirm delete account !!!
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                You won't be able to recover your account after deleting, are
                you sure to take this action?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmDialog}>Disagree</Button>
              <Button onClick={handelDeleteAccount} color="error">
                Delete Account
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
}
