import { toast } from 'react-toastify';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailed,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailed,
} from '../slice/userSlice';

import { BaseApi } from '../../constants/constant';

export const updateUser = async (
  accessToken,
  dispatch,
  id,
  axiosJWT,
  userData,
  toastTheme,
) => {
  dispatch(updateUserStart());
  try {
    const res = await axiosJWT.put(BaseApi + '/user/' + id, userData, {
      headers: { token: `Bearer ${accessToken}` },
      'Content-Type': 'multipart/form-data',
    });
    dispatch(updateUserSuccess(res.data.user));
    toast.success(res.data.message, toastTheme);
  } catch (err) {
    console.log(err);
    dispatch(updateUserFailed());
    toast.error(err.response.data.message, toastTheme);
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
    const res = await axiosJWT.delete(BaseApi + '/user/' + id, {
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
