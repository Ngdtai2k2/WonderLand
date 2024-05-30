import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { useColorScheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import ModalSelectLang from './modalSelectLang';
import ModalAuth from '../../pages/modalAuth';

import useUserAxios from '../../hooks/useUserAxios';
import { createAxios } from '../../createInstance';
import { logOutSuccess } from '../../redux/slice/userSlice';
import { logOut } from '../../redux/apiRequest/authApi';
import { useToastTheme } from '../../constants/constant';

export default function UserMenu({ anchorEl, setAnchorEl, handleClose }) {
  const [openModal, setOpenModal] = useState(false);
  const [openModalLang, setOpenModalLang] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toastTheme = useToastTheme;

  const { t, i18n } = useTranslation(['navigation']);
  const currentLanguage = i18n.language;

  const { user, accessToken } = useUserAxios(currentLanguage);
  const { mode, setMode } = useColorScheme();

  const handleOpenModal = () => {
    setOpenModal(true);
    handleClose();
  };

  const handelNavigate = (path) => {
    navigate(path);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logOut(
      dispatch,
      user?._id,
      user?.device,
      navigate,
      accessToken,
      createAxios(currentLanguage, user, dispatch, logOutSuccess),
      toastTheme,
      t,
      currentLanguage,
    );
  };

  return (
    <Menu
      sx={{ mt: '40px' }}
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {/* login */}
      {user ? null : (
        <MenuItem onClick={handleOpenModal}>
          {t('navigation:signup_or_login')}
        </MenuItem>
      )}
      <ModalAuth
        openModal={openModal}
        handleCloseModal={() => setOpenModal(false)}
      />
      {/* profile and settings account */}
      {user
        ? [
            <MenuItem
              key="profile"
              onClick={() => handelNavigate('/u/' + user?.nickname)}
            >
              {t('navigation:profile')}
            </MenuItem>,
            <MenuItem
              key="settings"
              onClick={() => handelNavigate('/settings')}
            >
              {t('navigation:settings_account')}
            </MenuItem>,
          ]
        : null}
      {/* select lang */}
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          setOpenModalLang(true);
        }}
      >
        {t('navigation:language')} ({currentLanguage})
      </MenuItem>
      <ModalSelectLang
        open={openModalLang}
        handleClose={() => setOpenModalLang(false)}
      />
      {/* dark mode */}
      <MenuItem onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
        <Typography>{t('navigation:darkmode')}</Typography>
        <Switch
          sx={{ marginLeft: 2 }}
          size="small"
          checked={mode === 'light' ? false : true}
        />
      </MenuItem>
      {/* logout */}
      {user ? (
        <MenuItem onClick={handleLogout}>{t('navigation:logout')}</MenuItem>
      ) : null}
    </Menu>
  );
}
