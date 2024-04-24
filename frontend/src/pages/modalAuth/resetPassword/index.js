import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';

import { BaseApi, toastTheme } from '../../../constants/constant';

export default function ResetPassword({ setTabIndex }) {
  const [fetching, setFetching] = useState();

  const email = localStorage.getItem('email_reset_password');

  const validationSchema = Yup.object({
    token: Yup.string()
      .required('Please provide tokens from your mail!')
      .max(6, 'Token no more than 6 characters'),
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
      token: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setFetching(true);
        const response = await axios.post(`${BaseApi}/auth/reset-password`, {
          email: email,
          token: values.token,
          newPassword: values.confirmPassword,
        });
        toast.success(response.data.message, toastTheme);
        localStorage.removeItem('email_reset_password');
        setTabIndex(0);
      } catch (error) {
        toast.error(error.response.data.message, toastTheme);
      } finally {
        setFetching(false);
      }
    },
  });
  return (
    <Box
      component="form"
      noValidate
      onSubmit={formik.handleSubmit}
      p={1}
      method="POST"
    >
      <TextField
        margin="normal"
        size="small"
        required
        fullWidth
        id="token"
        label="Token"
        name="token"
        autoComplete="token"
        value={formik.values.token}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.token && Boolean(formik.errors.token)}
        helperText={formik.touched.token && formik.errors.token}
      />
      <TextField
        size="small"
        type="password"
        margin="normal"
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
        error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
        helperText={formik.touched.newPassword && formik.errors.newPassword}
      />
      <TextField
        size="small"
        type="password"
        margin="normal"
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
      <LoadingButton
        type="submit"
        fullWidth
        loading={fetching ? fetching : false}
        variant="outlined"
        disabled={!formik.dirty || formik.isSubmitting || !formik.isValid}
        sx={{ my: 1 }}
      >
        Reset Password
      </LoadingButton>
    </Box>
  );
}
