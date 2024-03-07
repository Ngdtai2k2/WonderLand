import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { changePassword } from '../../redux/apiRequest/authApi';
import { createAxios } from '../../createInstance';
import { loginSuccess } from '../../redux/slice/userSlice';
import Button from '@mui/material/Button';

export default function ChangePassword() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const id = user?._id;
  const accessToken = user?.accessToken;
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  const validationSchema = Yup.object({
    oldPassword: Yup.string()
      .required('Password is required!')
      .min(8, 'Password is too short - should be 8 chars minimum!'),
    newPassword: Yup.string()
      .required('Password is required!')
      .min(8, 'Password is too short - should be 8 chars minimum!')
      .notOneOf(
        [Yup.ref('oldPassword')],
        'New password must be different from old password!',
      ),
    confirmPassword: Yup.string()
      .required('Confirm password is required!')
      .min(8, 'Password is too short - should be 8 chars minimum!')
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match!'),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { confirmPassword, ...passwordData } = values;
      await changePassword(dispatch, id, accessToken, axiosJWT, passwordData);
    },
  });

  return (
    <Box
      component="form"
      noValidate
      onSubmit={formik.handleSubmit}
      method="PUT"
    >
      <Typography variant="h5" fontWeight={700}>
        Reset Password
      </Typography>
      <Box marginTop={1} display="flex" flexDirection="column">
        <TextField
          type="password"
          margin="normal"
          variant="standard"
          required
          fullWidth
          id="oldPassword"
          label="Old Password"
          name="oldPassword"
          autoComplete="oldPassword"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockResetRoundedIcon />
              </InputAdornment>
            ),
          }}
          value={formik.values.oldPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
          }
          helperText={formik.touched.oldPassword && formik.errors.oldPassword}
        />
        <TextField
          type="password"
          margin="normal"
          variant="standard"
          required
          fullWidth
          id="newPassword"
          label="New Password"
          name="newPassword"
          autoComplete="newPassword"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <KeyRoundedIcon />
              </InputAdornment>
            ),
          }}
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.newPassword && Boolean(formik.errors.newPassword)
          }
          helperText={formik.touched.newPassword && formik.errors.newPassword}
        />
        <TextField
          type="password"
          margin="normal"
          variant="standard"
          required
          fullWidth
          value={formik.values.confirmPassword}
          label="Confirm Password"
          name="confirmPassword"
          autoComplete="confirmPassword"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <KeyRoundedIcon />
              </InputAdornment>
            ),
          }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />
      </Box>
      <Box display="flex" marginTop={5}>
        <Button
          type="submit"
          variant="contained"
          disabled={!formik.dirty || formik.isSubmitting || !formik.isValid}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
