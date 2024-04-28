import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';

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

  useEffect(() => {
    const rememberMeValue = localStorage.getItem('remenber_me') === 'true';
    setRememberMe(rememberMeValue);
  }, []);

  const initialEmail = localStorage.getItem('saved_email');

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address!')
      .max(50, 'Emails must be less than 50 characters!')
      .required('Email is required!'),
    password: Yup.string()
      .required('Password is required!')
      .min(8, 'Password is too short - should be 8 chars minimum!')
      .matches(/(?=.*[0-9])/, 'Password must contain a number!'),
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
      await loginUser(values, dispatch, toastTheme);
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
      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            value="remember"
            color="primary"
          />
        }
        label="Remember me"
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Sign In
      </Button>
      <Grid container>
        <Grid item xs>
          <Link
            onClick={() => {
              setTabIndex(2);
            }}
            variant="body2"
          >
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link
            onClick={() => {
              setTabIndex(1);
            }}
            variant="body2"
          >
            Don't have an account? Sign Up
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}
