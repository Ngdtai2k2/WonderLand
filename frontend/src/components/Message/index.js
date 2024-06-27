import React from 'react';
import moment from 'moment';

import { Tooltip, Typography, Box } from '@mui/material';
import {
  ImageMessage,
  PaperMessageReceiver,
  PaperMessageSender,
  VideoMessage,
} from './styles';

export default function MessageItem({
  mediaUrl,
  mediaType,
  message,
  createdAt,
  isSender = true,
}) {
  const PaperMessageComponent = isSender
    ? PaperMessageSender
    : PaperMessageReceiver;
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={isSender ? 'flex-end' : 'flex-start'}
      gap={1}
    >
      {mediaUrl && (
        <Tooltip title={moment(createdAt).fromNow()}>
          {mediaType === 0 ? (
            <ImageMessage src={mediaUrl} alt="" variant="square" />
          ) : (
            <VideoMessage autoPlay loop muted controls>
              <source src={mediaUrl} type="video/mp4" />
            </VideoMessage>
          )}
        </Tooltip>
      )}
      {message?.trim() !== '' && (
        <PaperMessageComponent>
          <Tooltip title={moment(createdAt).fromNow()}>
            <Typography variant="body1" fontWeight={500}>
              {message}
            </Typography>
          </Tooltip>
        </PaperMessageComponent>
      )}
    </Box>
  );
}
