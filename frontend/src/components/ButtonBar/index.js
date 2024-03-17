import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded';
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';

import CustomBox from '../CustomBox';
import { Link } from '@mui/material';

export default function ButtonBar() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const getVariant = (link) => {
    return link === activeLink ? 'contained' : 'outlined';
  };

  return (
    <CustomBox>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={0.5}
        flexWrap="wrap"
      >
        <Link
          href="/"
          style={{ textDecoration: 'none' }}
          onClick={() => handleLinkClick('/')}
        >
          <Button
            variant={getVariant('/')}
            size="small"
            startIcon={<HomeRoundedIcon />}
          >
            Home
          </Button>
        </Link>
        <Link
          href="/top"
          style={{ textDecoration: 'none' }}
          onClick={() => handleLinkClick('/top')}
        >
          <Button
            variant={getVariant('/top')}
            size="small"
            startIcon={<BarChartRoundedIcon />}
          >
            Top
          </Button>
        </Link>
        <Link
          href="/trend"
          style={{ textDecoration: 'none' }}
          onClick={() => handleLinkClick('/trend')}
        >
          <Button
            variant={getVariant('/trend')}
            size="small"
            startIcon={<TrendingUpRoundedIcon />}
          >
            Trend
          </Button>
        </Link>
        <Link
          href="/fresh"
          style={{ textDecoration: 'none' }}
          onClick={() => handleLinkClick('/fresh')}
        >
          <Button
            variant={getVariant('/fresh')}
            size="small"
            startIcon={<RestoreRoundedIcon />}
          >
            Fresh
          </Button>
        </Link>
        <Link
          href="/ask"
          style={{ textDecoration: 'none' }}
          onClick={() => handleLinkClick('/ask')}
        >
          <Button
            variant={getVariant('/ask')}
            size="small"
            startIcon={<QuestionMarkRoundedIcon />}
          >
            Ask
          </Button>
        </Link>
      </Box>
    </CustomBox>
  );
}
