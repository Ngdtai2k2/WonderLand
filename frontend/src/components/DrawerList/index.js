import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded';
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function DrawerList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    navigate(link);
  };

  const setSelectedLink = (link) => {
    return link === activeLink ? true : false;
  };
  return (
    <List>
      <ListItem>
        <Link href="/" underline="none" variant="inherit">
          Wonder Land
        </Link>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          selected={setSelectedLink('/')}
          onClick={() => handleLinkClick('/')}
        >
          <ListItemIcon>
            <HomeRoundedIcon />
          </ListItemIcon>
          <ListItemText primary={'Home'} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          selected={setSelectedLink('/top')}
          onClick={() => handleLinkClick('/top')}
        >
          <ListItemIcon>
            <BarChartRoundedIcon />
          </ListItemIcon>
          <ListItemText primary={'Top'} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          selected={setSelectedLink('/trend')}
          onClick={() => handleLinkClick('/trend')}
        >
          <ListItemIcon>
            <TrendingUpRoundedIcon />
          </ListItemIcon>
          <ListItemText primary={'Trend'} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          selected={setSelectedLink('/fresh')}
          onClick={() => handleLinkClick('/fresh')}
        >
          <ListItemIcon>
            <RestoreRoundedIcon />
          </ListItemIcon>
          <ListItemText primary={'Fresh'} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          selected={setSelectedLink('/ask')}
          onClick={() => handleLinkClick('/ask')}
        >
          <ListItemIcon>
            <QuestionMarkRoundedIcon />
          </ListItemIcon>
          <ListItemText primary={'Ask'} />
        </ListItemButton>
      </ListItem>
    </List>
  );
}

export default DrawerList;
