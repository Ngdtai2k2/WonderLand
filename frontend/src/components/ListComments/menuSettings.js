import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import ModalReportComment from './modalReportComment';
import useUserAxios from '../../hooks/useUserAxios';

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

  const { t, i18n } = useTranslation(['post']);
  const { user } = useUserAxios(i18n.language);

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
            {t('post:comment.delete')}
          </MenuItem>,
          <MenuItem key={`edit-${id}`} onClick={handleCloseMenu}>
            {t('post:comment.edit')}
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
            {t('post:comment.report')}
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
