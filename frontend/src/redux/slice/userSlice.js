import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'auth',
  initialState: {
    login: {
      currentUser: null,
      isFetching: false,
      error: false,
    },
    register: {
      isFetching: false,
      error: false,
      success: false,
    },
  },
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.error = false;
    },
    loginFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
    registerStart: (state) => {
      state.register.isFetching = true;
    },
    registerSuccess: (state) => {
      state.register.isFetching = false;
      state.register.error = false;
      state.register.success = true;
    },
    registerFailed: (state) => {
      state.register.isFetching = false;
      state.register.error = true;
      state.register.success = false;
    },
    logOutStart: (state) => {
      state.login.isFetching = true;
    },
    logOutSuccess: (state) => {
      state.login.isFetching = false;
      state.login.currentUser = null;
      state.login.error = false;
    },
    logOutFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
    updateUserStart: (state) => {
      state.login.isFetching = true;
    },
    updateUserSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = {
        ...state.login.currentUser,
        ...action.payload,
      };
      state.login.error = false;
    },
    updateUserFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
    deleteUserStart: (state) => {
      state.login.isFetching = true;
    },
    deleteUserSuccess: (state) => {
      state.login.isFetching = false;
      state.login.currentUser = null;
      state.login.error = false;
    },
    deleteUserFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
    changePasswordStart: (state) => {
      state.login.isFetching = true;
    },
    changePasswordSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = {
        ...state.login.currentUser,
        ...action.payload,
      };
      state.login.error = false;
    },
    changePasswordFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
  },
});

export const {
  loginStart,
  loginFailed,
  loginSuccess,
  registerStart,
  registerSuccess,
  registerFailed,
  logOutStart,
  logOutSuccess,
  logOutFailed,
  updateUserStart,
  updateUserSuccess,
  updateUserFailed,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailed,
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailed,
} = userSlice.actions;

export default userSlice.reducer;
