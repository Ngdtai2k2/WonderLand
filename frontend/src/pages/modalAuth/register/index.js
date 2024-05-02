import React, { useState } from 'react';
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

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address!')
      .max(50, 'Emails must be less than 50 characters!')
      .required('Email is required!'),
    password: Yup.string()
      .required('Password is required!')
      .min(8, 'Password is too short - should be 8 chars minimum!'),
    fullname: Yup.string()
      .required('Full name is required!')
      .matches(/^[^\d]+$/, 'Full name cannot contain digits'),
    nickname: Yup.string()
      .min(5, 'Nickname must be at least 5 characters')
      .max(20, 'Nickname must be less than 20 characters!')
      .required('Nickname is required!')
      .matches(
        /^[a-zA-Z0-9]+$/,
        'Nickname can only contain Latin characters and numbers',
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
      await registerUser(values, dispatch, toastTheme);
      setTabIndex(0);
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
      const response = await axios.post(`${BaseApi}/auth/check-nickname`, {
        nickname: nickname,
      });
      setUniqueNickName(response.data.unique);

      if (!response.data.unique) {
        formik.setFieldError('nickname', 'Nickname is not unique');
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
        label="Full Name"
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
      <Typography
        variant="caption"
        color={uniqueNickName ? '' : 'error'}
      >
        {process.env.REACT_APP_DOMAIN}/u/{formik.values.nickname}
      </Typography>
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
      <TextField
        margin="normal"
        size="small"
        required
        fullWidth
        name="password"
        label="Password"
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
        Register
      </Button>
      <Grid container>
        <Grid item>
          <Link
            onClick={() => {
              setTabIndex(0);
            }}
            variant="body2"
          >
            {'Already have an account? Sign in now!'}
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}
