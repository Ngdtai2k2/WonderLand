import React, { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import Zoom from 'react-medium-image-zoom';
import axios from 'axios';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import PetsRoundedIcon from '@mui/icons-material/PetsRounded';

import LoadingCircularIndeterminate from '../Loading';

import {
  ImagesNoData,
  createElementStyleForZoom,
} from '../../constants/constant';
import { getFileExtension } from '../../utils/helperFunction';

export default function FunnyImages() {
  const [imageURL, setImageURL] = useState();
  const [type, setType] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(2);

  const theme = useTheme();

  const getImageRandom = async (type) => {
    try {
      setIsLoading(true);
      if (type === 2) {
        const response = await axios.get(
          process.env.REACT_APP_API_THE_DOG_FUNNY_RANDOM,
        );
        setImageURL(response.data.url);
      } else {
        const url =
          type === 0
            ? process.env.REACT_APP_API_THE_CAT_RANDOM
            : process.env.REACT_APP_API_THE_DOG_RANDOM;
        const response = await axios.get(url);
        setImageURL(response.data[0].url);
      }
    } catch (error) {
      setImageURL(ImagesNoData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getImageRandom(value);
  }, [value]);

  useEffect(() => {
    if (imageURL) {
      const path = getFileExtension(imageURL);
      setType(path);
    }
  }, [imageURL]);

  useEffect(() => {
    createElementStyleForZoom(theme);
  }, [theme, theme.palette.mode]);

  return (
    <Paper
      elevation={1}
      sx={{ position: 'sticky', top: 75, padding: 1.5, marginLeft: 1 }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" fontWeight={600}>
          ~UwU~
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          <IconButton
            size="small"
            onClick={() => setValue(0)}
            disabled={value === 0}
          >
            <PetsRoundedIcon sx={{ fontSize: '16px', cursor: 'pointer' }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setValue(1)}
            disabled={value === 1}
          >
            <PetsRoundedIcon sx={{ fontSize: '16px', cursor: 'pointer' }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setValue(2)}
            disabled={value === 2}
          >
            <PetsRoundedIcon sx={{ fontSize: '16px', cursor: 'pointer' }} />
          </IconButton>
        </Box>
      </Box>
      <Box width="100%" marginTop={1}>
        {isLoading ? (
          <LoadingCircularIndeterminate />
        ) : type === 'mp4' ? (
          <video
            width="100%"
            height="200px"
            autoPlay
            loop
            muted
            style={{ borderRadius: 3 }}
          >
            <source src={imageURL} type="video/mp4" />
          </video>
        ) : (
          <Zoom>
            <img
              src={imageURL}
              alt="Random cute moment"
              width="100%"
              height="200px"
              loading="lazy"
              style={{ borderRadius: 3, objectFit: 'cover' }}
            />
          </Zoom>
        )}
      </Box>
    </Paper>
  );
}
