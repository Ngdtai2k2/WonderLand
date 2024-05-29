import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

import { BaseApi, useToastTheme } from '../../../constants/constant';

export default function ForgetPassword({ setTabIndex }) {
  const [fetching, setFetching] = useState();

  const toastTheme = useToastTheme();
  const { t } = useTranslation(['validate', 'auth']);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('validate:email.invalid'))
      .max(50, t('validate:max', { name: 'Email', max: '50' }))
      .required(t('validate:required_field', { name: 'Email' })),
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
        label={t('field:email')}
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
        {t('auth:send')}
      </LoadingButton>
    </Box>
  );
}
