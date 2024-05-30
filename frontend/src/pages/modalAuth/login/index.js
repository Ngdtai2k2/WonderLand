import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';

import { loginUser } from '../../../redux/apiRequest/authApi';
import { useToastTheme } from '../../../constants/constant';

export default function Login({ setTabIndex }) {
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const toastTheme = useToastTheme();
  const { t, i18n } = useTranslation(['validate', 'field', 'auth', 'message']);

  useEffect(() => {
    const rememberMeValue = localStorage.getItem('remenber_me') === 'true';
    setRememberMe(rememberMeValue);
  }, []);

  const initialEmail = localStorage.getItem('saved_email');

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('validate:email.invalid'))
      .max(50, t('validate:max', { name: 'Email', max: '50' }))
      .required(t('validate:required_field', { name: 'Email' })),
    password: Yup.string()
      .required(t('validate:required_field', { name: t('field:password') }))
      .min(8, t('validate:min', { name: t('field:password'), min: '8' }))
      .matches(
        /(?=.*[0-9])/,
        t('validate:matches_contain_number', { name: t('field:password') }),
      ),
  });

  const formik = useFormik({
    initialValues: {
      email: initialEmail || '',
      password: '',
    },

    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (rememberMe) {
        localStorage.setItem('remenber_me', 'true');
        localStorage.setItem('saved_email', values.email);
      } else {
        localStorage.removeItem('remenber_me');
        localStorage.removeItem('saved_email');
      }
      await loginUser(values, dispatch, toastTheme, i18n.language);
    },
  });

  return (
    <Box
      component="form"
      noValidate
      onSubmit={formik.handleSubmit}
      marginTop={1}
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
      <TextField
        margin="normal"
        size="small"
        required
        fullWidth
        name="password"
        label={t('field:password')}
        type="password"
        id="password"
        autoComplete="current-password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            value="remember"
            color="primary"
          />
        }
        label={t('field:remember_me')}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {t('auth:sign_in')}
      </Button>
      <Grid container>
        <Grid item xs>
          <Link
            onClick={() => {
              setTabIndex(2);
            }}
            variant="body2"
          >
            {t('auth:forgot_password')}
          </Link>
        </Grid>
        <Grid item>
          <Link
            onClick={() => {
              setTabIndex(1);
            }}
            variant="body2"
          >
            {t('message:dont_account')} {t('auth:sign_up')}
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}
