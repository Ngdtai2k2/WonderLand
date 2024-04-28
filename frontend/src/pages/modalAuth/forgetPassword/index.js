import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

import { BaseApi, useToastTheme } from '../../../constants/constant';
import { toast } from 'react-toastify';

export default function ForgetPassword({ setTabIndex }) {
  const [fetching, setFetching] = useState();

  const toastTheme = useToastTheme();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address!')
      .max(50, 'Emails must be less than 50 characters!')
      .required('Email is required!'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setFetching(true);
        const response = await axios.post(`${BaseApi}/auth/forgot-password`, {
          email: values.email,
        });
        localStorage.setItem('email_reset_password', values.email);
        toast.success(response.data.message, toastTheme);
        setTabIndex(3);
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
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />
      <LoadingButton
        type="submit"
        fullWidth
        loading={fetching ? fetching : false}
        variant="outlined"
        disabled={!formik.dirty || formik.isSubmitting || !formik.isValid}
        sx={{ my: 1 }}
      >
        Send
      </LoadingButton>
    </Box>
  );
}
