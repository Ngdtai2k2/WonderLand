import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import ModalReportForm from './modalReportForm';

export default function MenuSettings({
  id,
  menuAnchorEl,
  isMenuOpen,
  handleCloseMenu,
}) {
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;

  const decodedToken = accessToken ? jwtDecode(accessToken) : null;
  const isAdmin = decodedToken ? decodedToken.isAdmin || false : false;

  return (
    <>
      <Menu
        key={`menu-post-${id}`}
        id={`menu-post-${id}`}
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
            key={`report-${id}`}
            onClick={() => {
              handleCloseMenu();
              setOpen(true);
            }}
          >
            Report
          </MenuItem>
        )}
        <MenuItem key={`download-${id}`} onClick={handleCloseMenu}>
          Download media
        </MenuItem>
      </Menu>
      {!isAdmin && (
        <ModalReportForm
          open={open}
          handleClose={() => setOpen(false)}
          id={id}
        />
      )}
    </>
  );
}
