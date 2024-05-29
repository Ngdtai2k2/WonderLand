import React from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';

import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

import { copyText } from '../../utils/helperFunction';
import { useToastTheme } from '../../constants/constant';

export default function MenuShare({
  post,
  menuAnchorEl,
  isMenuOpen,
  handleCloseMenu,
}) {
  const toastTheme = useToastTheme();

  const urlShareFacebook = 'https://www.facebook.com/sharer/sharer.php?u=';
  const urlShareTelegram = 'https://t.me/share/url?url=';
  const urlPost = `${process.env.REACT_APP_DOMAIN}/post/${post?._id}`;

  const openBlankPage = (prefixUrlShare, url) => {
    window.open(prefixUrlShare + url, '_blank');
  };

  return (
    <Menu
      key={`menu-share-${post?._id}`}
      id={`menu-share-${post?._id}`}
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
      <MenuItem
        onClick={() =>
          copyText(
            `${process.env.REACT_APP_DOMAIN}/post/${post?._id}`,
            toastTheme,
          )
        }
      >
        <ListItemIcon>
          <ContentPasteRoundedIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body1">Copy link</Typography>
      </MenuItem>
      <MenuItem onClick={() => openBlankPage(urlShareFacebook, urlPost)}>
        <ListItemIcon>
          <FacebookRoundedIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body1">Share to facebook</Typography>
      </MenuItem>
      <MenuItem onClick={() => openBlankPage(urlShareTelegram, urlPost)}>
        <ListItemIcon>
          <SendRoundedIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body1">Share to telegram</Typography>
      </MenuItem>
    </Menu>
  );
}
