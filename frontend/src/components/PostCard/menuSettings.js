import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import ModalReportForm from './modalReportForm';
import { handleDeletePost } from '../../utils/postServices';
import useUserAxios from '../../hooks/useUserAxios';
import { useToastTheme } from '../../constants/constant';
import ModalEditPost from './modalEditPost';

export default function MenuSettings({
  post,
  menuAnchorEl,
  isMenuOpen,
  handleCloseMenu,
  setState,
}) {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const toastTheme = useToastTheme();
  const { t, i18n } = useTranslation(['post']);
  const { user, accessToken, axiosJWT } = useUserAxios(i18n.language);

  const decodedToken = accessToken ? jwtDecode(accessToken) : null;
  const isAdmin = decodedToken ? decodedToken.isAdmin || false : false;

  return (
    <>
      <Menu
        key={`menu-post-${post?._id}`}
        id={`menu-post-${post?._id}`}
        anchorEl={menuAnchorEl}
        open={isMenuOpen || false}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {!isAdmin && (
          <MenuItem
            key={`report-${post?._id}`}
            onClick={() => {
              handleCloseMenu();
              setOpen(true);
            }}
          >
            {t('post:settings.report')}
          </MenuItem>
        )}
        {post?.author?._id === user?._id && [
          <MenuItem
            key={`delete-${post?._id}`}
            onClick={() =>
              handleDeletePost(
                post?._id,
                user?._id,
                axiosJWT,
                accessToken,
                toastTheme,
                setState,
              )
            }
          >
            {t('post:settings.delete')}
          </MenuItem>,
          <MenuItem
            key={`edit-${post?._id}`}
            onClick={() => {
              handleCloseMenu();
              setOpenEdit(true);
            }}
          >
            {t('post:settings.edit')}
          </MenuItem>,
        ]}
        <MenuItem key={`download-${post?._id}`} onClick={handleCloseMenu}>
          {t('post:settings.download_media')}
        </MenuItem>
      </Menu>
      {post?.author?._id === user?._id && (
        <ModalEditPost
          open={openEdit}
          handleClose={() => setOpenEdit(false)}
          id={post?._id}
          setState={setState}
        />
      )}
      {!isAdmin && (
        <ModalReportForm
          open={open}
          handleClose={() => setOpen(false)}
          id={post?._id}
        />
      )}
    </>
  );
}
