import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';

import { API } from '../../../api';
import { useToastTheme } from '../../../constants/constant';

export default function ResetPassword({ setTabIndex }) {
  const [fetching, setFetching] = useState();

  const toastTheme = useToastTheme();
  const email = localStorage.getItem('email_reset_password');
  const { t } = useTranslation(['validate', 'field', 'auth']);

  const validationSchema = Yup.object({
    token: Yup.string()
      .required(t('validate:token'))
      .max(6, t('validate:min', { name: 'Token', min: '6' })),
    newPassword: Yup.string()
      .required(t('validate:required_field', { name: t('field:password') }))
      .min(8, t('validate:min', { name: t('field:password'), min: '8' }))
      .notOneOf(
        [Yup.ref('oldPassword')],
        t('validate:not_one_of_new_password'),
      ),
    confirmPassword: Yup.string()
      .required(
        t('validate:required_field', { name: t('field:confirm_password') }),
      )
      .min(8, t('validate:min', { name: t('field:password'), min: '8' }))
      .oneOf(
        [Yup.ref('newPassword'), null],
        t('validate:must_match', { name: t('field:password') }),
      ),
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
        const response = await axios.post(API.AUTH.RESET_PASSWORD, {
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
        label={t('field:new_password')}
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
        label={t('field:confirm_password')}
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
        {t('auth:reset_password')}
      </LoadingButton>
    </Box>
  );
}
