import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React from 'react';

import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';

import useUserAxios from '../../hooks/useUserAxios';
import { changePassword } from '../../redux/apiRequest/authApi';
import { createAxios } from '../../createInstance';
import { loginSuccess } from '../../redux/slice/userSlice';
import { useToastTheme } from '../../constants/constant';

export default function ChangePassword() {
  const dispatch = useDispatch();
  const toastTheme = useToastTheme();
  const { t, i18n } = useTranslation(['validate', 'field', 'settings']);
  const { user, accessToken } = useUserAxios(i18n.language);

  const id = user?._id;
  let axiosJWT = createAxios(i18n.language, user, dispatch, loginSuccess);

  const validationSchema = Yup.object({
    oldPassword: Yup.string()
      .required(t('validate:required_field', { name: t('field:password') }))
      .min(8, t('validate:min', { name: t('field:password'), min: '8' }))
      .matches(
        /(?=.*[0-9])/,
        t('validate:matches_contain_number', { name: t('field:password') }),
      ),
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
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { confirmPassword, ...passwordData } = values;
      await changePassword(
        dispatch,
        id,
        accessToken,
        axiosJWT,
        passwordData,
        toastTheme,
        i18n.language,
      );
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
        {t('settings:reset_password')}
      </Typography>
      <Box marginTop={1} display="flex" flexDirection="column">
        <TextField
          type="password"
          margin="normal"
          variant="standard"
          required
          fullWidth
          id="oldPassword"
          label={t('field:old_password')}
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
      </Box>
      <Box display="flex" marginTop={5}>
        <Button
          type="submit"
          variant="contained"
          disabled={!formik.dirty || formik.isSubmitting || !formik.isValid}
        >
          {t('settings:save')}
        </Button>
      </Box>
    </Box>
  );
}
