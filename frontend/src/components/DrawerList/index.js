import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import CustomListItemButton from '../CustomListItemButton';
import { adminDrawerList, publicDrawerList } from '../../constants/drawerlist';

function DrawerList({ isAdmin }) {
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

  const itemsToMap = isAdmin ? adminDrawerList : publicDrawerList;

  return (
    <List>
      <ListItem>
        <Link href="/" underline="none" variant="inherit">
          Wonder Land
        </Link>
      </ListItem>
      {itemsToMap.map((item, index) => (
        <CustomListItemButton
          key={index}
          selected={setSelectedLink(item.link)}
          onClick={() => handleLinkClick(item.link)}
          icon={item.icon}
          text={item.text}
        />
      ))}
    </List>
  );
}

export default DrawerList;
