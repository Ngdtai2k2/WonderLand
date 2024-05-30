import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { registerUser } from '../../../redux/apiRequest/authApi';
import { useToastTheme, BaseApi } from '../../../constants/constant';

export default function Register({ setTabIndex }) {
  const [uniqueNickName, setUniqueNickName] = useState();

  const dispatch = useDispatch();
  const toastTheme = useToastTheme();
  const { t, i18n } = useTranslation(['validate', 'field', 'auth', 'message']);

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
    fullname: Yup.string()
      .required(t('validate:required_field', { name: t('field:fullname') }))
      .matches(
        /^[^\d]+$/,
        t('validate:matches_not_contain_digits', { name: t('field:fullname') }),
      ),
    nickname: Yup.string()
      .min(5, t('validate:min', { name: 'Nickname', min: '5' }))
      .max(20, t('validate:max', { name: 'Nickname', max: '20' }))
      .required(t('validate:required_field', { name: 'Nickname' }))
      .matches(
        /^[a-zA-Z0-9]+$/,
        t('validate:matches_contain_number_latin', { name: 'Nickname' }),
      ),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      fullname: '',
      password: '',
      nickname: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const res = await registerUser(
        values,
        dispatch,
        toastTheme,
        i18n.language,
      );
      setTabIndex(res ? 0 : 1);
    },
  });

  const handleCheckNickName = async (event) => {
    const nickname = event.target.value;
    formik.setFieldTouched('nickname', true);
    formik.setFieldValue('nickname', nickname);
    if (
      nickname !== '' &&
      nickname.length > 5 &&
      !Boolean(formik.errors.nickname)
    ) {
      const response = await axios.post(
        `${BaseApi}/auth/check-nickname`,
        {
          nickname: nickname,
        },
        {
          headers: {
            'Accept-Language': i18n.language,
          },
        },
      );
      setUniqueNickName(response.data.unique);

      if (!response.data.unique) {
        formik.setFieldError(
          'nickname',
          t('validate:not_unique', { name: 'Nickname' }),
        );
      }
    }
  };

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
        id="fullname"
        label={t('field:fullname')}
        name="fullname"
        autoComplete="fullname"
        value={formik.values.fullname}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.fullname && Boolean(formik.errors.fullname)}
        helperText={formik.touched.fullname && formik.errors.fullname}
      />
      <TextField
        margin="normal"
        size="small"
        required
        fullWidth
        id="nickname"
        label="Nick Name"
        name="nickname"
        autoComplete="nickname"
        value={formik.values.nickname}
        onChange={handleCheckNickName}
        onBlur={formik.handleBlur}
        error={formik.touched.nickname && Boolean(formik.errors.nickname)}
        helperText={formik.touched.nickname && formik.errors.nickname}
      />
      <Typography variant="caption" color={uniqueNickName ? '' : 'error'}>
        {process.env.REACT_APP_DOMAIN}/u/{formik.values.nickname}
      </Typography>
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
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {t('auth:sign_up')}
      </Button>
      <Grid container>
        <Grid item>
          <Link
            onClick={() => {
              setTabIndex(0);
            }}
            variant="body2"
            sx={{ cursor: 'pointer' }}
          >
            {t('message:has_account')}
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}
