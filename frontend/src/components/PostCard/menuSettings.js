import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import ModalReportForm from './modalReportForm';
import { handleDeletePost } from '../../utils/postServices';
import useUserAxios from '../../hooks/useUserAxios';
import { useToastTheme } from '../../constants/constant';

export default function MenuSettings({
  post,
  menuAnchorEl,
  isMenuOpen,
  handleCloseMenu,
  setState,
}) {
  const [open, setOpen] = useState(false);

  const toastTheme = useToastTheme();
  const { user, accessToken, axiosJWT } = useUserAxios();

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
            Report
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
            Delete
          </MenuItem>,
          <MenuItem key={`edit-${post?._id}`} onClick={handleCloseMenu}>
            Edit
          </MenuItem>,
        ]}
        <MenuItem key={`download-${post?._id}`} onClick={handleCloseMenu}>
          Download media
        </MenuItem>
      </Menu>
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
