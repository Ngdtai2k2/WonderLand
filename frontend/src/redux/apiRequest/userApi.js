import { toast } from 'react-toastify';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailed,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailed,
} from '../slice/userSlice';

import { API } from '../../api/base';

export const updateUser = async (
  lng,
  accessToken,
  dispatch,
  id,
  axiosJWT,
  userData,
  toastTheme,
) => {
  dispatch(updateUserStart());
  try {
    const res = await axiosJWT.put(API.USER.UPDATE(id), userData, {
      headers: {
        token: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
        'Accept-Language': lng,
      },
    });
    dispatch(updateUserSuccess(res.data.user));
    toast.success(res.data.message, toastTheme);
  } catch (err) {
    dispatch(updateUserFailed());
    toast.error(err.response.data.message, toastTheme);
  }
};

export const updateMedia = async (
  lng,
  accessToken,
  dispatch,
  userId,
  axiosJWT,
  data,
  toastTheme,
) => {
  dispatch(updateUserStart());
  try {
    const res = await axiosJWT.put(API.USER.CHANGE_AVATAR(userId), data, {
      headers: {
        token: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
        'Accept-Language': lng,
      },
    });
    dispatch(updateUserSuccess(res.data.user));
    toast.success(res.data.message, toastTheme);
    return res.data.user;
  } catch (error) {
    dispatch(updateUserFailed());
    toast.error(error.response.data.message, toastTheme);
  }
};

export const deleteUser = async (
  accessToken,
  navigate,
  dispatch,
  id,
  axiosJWT,
  toastTheme,
) => {
  dispatch(deleteUserStart());
  try {
    const res = await axiosJWT.delete(API.USER.DELETE, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(deleteUserSuccess(res.data.user));
    toast.success(res.data.message, toastTheme);
    navigate('/');
  } catch (err) {
    dispatch(deleteUserFailed());
    toast.error(err.response.data.message, toastTheme);
  }
};
