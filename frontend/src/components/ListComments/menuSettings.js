import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import ModalReportComment from './modalReportComment';

export default function MenuSettings({
  id,
  commentId,
  author,
  menuAnchorEl,
  isMenuOpen,
  handleCloseMenu,
  handleDelete,
  isReply,
}) {
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.auth.login?.currentUser);

  return (
    <>
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
        {author !== user?._id && (
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
      </Menu>
      {author !== user?._id && (
        <ModalReportComment
          open={open}
          handleClose={() => setOpen(false)}
          id={id}
          isReply={isReply}
          commentId={commentId}
        />
      )}
    </>
  );
}
