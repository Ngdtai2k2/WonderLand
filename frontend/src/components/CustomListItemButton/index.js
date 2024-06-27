import React from 'react';
import LazyLoad from 'react-lazyload';

import Avatar from '@mui/material/Avatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';

export default function CustomListItemButton({
  selected,
  onClick,
  icon,
  text,
  category,
}) {
  return (
    <ListItem disablePadding>
      <ListItemButton selected={selected} onClick={onClick}>
        {category ? (
          <ListItemIcon sx={{ marginRight: -1 }}>
            <LazyLoad height={35} once>
              <Avatar
                src={category.media.url}
                variant="rounded"
                alt={`${category.name}'s avatar`}
                sx={{
                  width: 35,
                  height: 35,
                }}
              />
            </LazyLoad>
          </ListItemIcon>
        ) : (
          <ListItemIcon sx={{ marginRight: -1 }}>{icon}</ListItemIcon>
        )}
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}
