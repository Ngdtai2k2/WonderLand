import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import CustomListItemButton from '../CustomListItemButton';
import { adminDrawerList, publicDrawerList } from '../../constants/drawerlist';
import { BaseApi } from '../../constants/constant';
import LoadingCircularIndeterminate from '../Loading';

function DrawerList({ isAdmin }) {
  const location = useLocation();

  const [categories, setCategories] = useState();
  const [loading, setLoading] = useState(false);
  const [activeLink, setActiveLink] = useState(location.pathname);

  const navigate = useNavigate();

  const handleLinkClick = (link) => {
    setActiveLink(link);
    navigate(link);
  };

  const setSelectedLink = (link) => {
    return link === activeLink ? true : false;
  };

  const itemsToMap = isAdmin ? adminDrawerList : publicDrawerList;

  const getCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BaseApi}/category`);
      setCategories(response.data.result.docs);
      localStorage.setItem(
        'list-of-categories',
        JSON.stringify(response.data.result.docs),
      );
    } catch (error) {
      setCategories(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedCategories = localStorage.getItem('list-of-categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      getCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
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
      <Typography variant="body1" marginLeft={1} marginY={1}>
        Discover
      </Typography>
      {loading ? (
        <LoadingCircularIndeterminate />
      ) : categories ? (
        categories.map((category) => (
          <CustomListItemButton
            key={category._id}
            selected={setSelectedLink(`/category/${category.name}`)}
            onClick={() => handleLinkClick(`/category/${category.name}`)}
            category={category}
            text={category.name}
          />
        ))
      ) : (
        <Typography
          variant="body2"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          No categories!
        </Typography>
      )}
    </List>
  );
}

export default DrawerList;
