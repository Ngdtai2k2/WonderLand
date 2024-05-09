import React from 'react';
import { useSelector } from 'react-redux';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function MenuSettings({
  id,
  author,
  menuAnchorEl,
  isMenuOpen,
  handleCloseMenu,
  handleDelete,
}) {
  const user = useSelector((state) => state.auth.login?.currentUser);
  return (
    <Menu
      key={`menu-${id}`}
      id={`menu-${id}`}
      anchorEl={menuAnchorEl}
      open={isMenuOpen || false}
      onClose={handleCloseMenu}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      {author === user?._id && [
        <MenuItem key={`delete-${id}`} onClick={handleDelete}>
          Delete
        </MenuItem>,
        <MenuItem key={`edit-${id}`} onClick={handleCloseMenu}>
          Edit
        </MenuItem>,
      ]}
      <MenuItem key={`report-${id}`} onClick={handleCloseMenu}>
        Report
      </MenuItem>
    </Menu>
  );
}
