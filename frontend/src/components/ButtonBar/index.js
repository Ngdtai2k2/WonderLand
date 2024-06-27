import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded';
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';

import CustomBox from '../CustomBox';

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
            aria-label="Home"
          >
            Home
          </Button>
        </Link>
        <Link
          href="/top"
          style={{ textDecoration: 'none' }}
          onClick={() => handleLinkClick('/top')}
          aria-label="top post"
        >
          <Button
            variant={getVariant('/top')}
            size="small"
            startIcon={<BarChartRoundedIcon />}
            aria-label="Top post"
          >
            Top
          </Button>
        </Link>
        <Link
          href="/trend"
          style={{ textDecoration: 'none' }}
          onClick={() => handleLinkClick('/trend')}
          aria-label="trend post"
        >
          <Button
            variant={getVariant('/trend')}
            size="small"
            startIcon={<TrendingUpRoundedIcon />}
            aria-label="trend post"
          >
            Trend
          </Button>
        </Link>
        <Link
          href="/fresh"
          style={{ textDecoration: 'none' }}
          onClick={() => handleLinkClick('/fresh')}
          aria-label="fresh post"
        >
          <Button
            variant={getVariant('/fresh')}
            size="small"
            startIcon={<RestoreRoundedIcon />}
            aria-label="fresh post"
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
