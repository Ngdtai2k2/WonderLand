import axios from 'axios';
import { toast } from 'react-toastify';

import {
  changePasswordFailed,
  changePasswordStart,
  changePasswordSuccess,
  loginFailed,
  loginStart,
  loginSuccess,
  logOutFailed,
  logOutStart,
  logOutSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from '../slice/userSlice';

import { BaseApi } from '../../constants/constant';

export const loginUser = async (user, dispatch, toastTheme) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(BaseApi + '/auth/login', user);
    dispatch(loginSuccess(res.data));
    toast.success(res.data.message, toastTheme);
    window.location.reload();
  } catch (err) {
    dispatch(loginFailed(err.response.data));
    toast.error(err.response.data.message, toastTheme);
  }
};

export const registerUser = async (user, dispatch, toastTheme) => {
  dispatch(registerStart());
  try {
    const res = await axios.post(BaseApi + '/auth/register', user);
    toast.success(res.data.message, toastTheme);
    dispatch(registerSuccess());
  } catch (err) {
    dispatch(registerFailed());
    toast.error(err.response.data.message, toastTheme);
  }
};

export const logOut = async (
  dispatch,
  id,
  device,
  navigate,
  accessToken,
  axiosJWT,
  toastTheme,
  t,
) => {
  dispatch(logOutStart());
  try {
    await axiosJWT.post(
      BaseApi + '/auth/logout',
      { id, device },
      {
        headers: { token: `Bearer ${accessToken}` },
        'Content-Type': 'multipart/form-data',
      },
    );
    dispatch(logOutSuccess());
    toast.success(t('message:auth.logout_success'), toastTheme);
    navigate('/');
    window.location.reload();
  } catch (err) {
    dispatch(logOutFailed());
    toast.error(err.response.data.message, toastTheme);
  }
};

export const changePassword = async (
  dispatch,
  id,
  accessToken,
  axiosJWT,
  userData,
  toastTheme,
) => {
  dispatch(changePasswordStart());
  try {
    const res = await axiosJWT.put(BaseApi + '/auth/password/' + id, userData, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(changePasswordSuccess());
    toast.success(res.data.message, toastTheme);
  } catch (err) {
    dispatch(changePasswordFailed());
    toast.error(err.response.data.message, toastTheme);
  }
};
