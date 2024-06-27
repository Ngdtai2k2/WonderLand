import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { API } from '../../api/base';
import CustomListItemButton from '../CustomListItemButton';
import { AdminDrawerList, PublicDrawerList } from '../../constants/drawerlist';
import LoadingCircularIndeterminate from '../Loading';

function DrawerList({ isAdmin }) {
  const location = useLocation();

  const [categories, setCategories] = useState();
  const [loading, setLoading] = useState(false);
  const [activeLink, setActiveLink] = useState(location.pathname);

  const navigate = useNavigate();
  const { t } = useTranslation(['home', 'sidebar', 'message']);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    navigate(link);
  };

  const setSelectedLink = (link) => {
    return link === activeLink ? true : false;
  };

  const itemsToMap = isAdmin ? AdminDrawerList() : PublicDrawerList();

  const getCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API.CATEGORY.BASE);
      sessionStorage.setItem(
        'categories',
        JSON.stringify(response.data.result.docs),
      );
    } catch (error) {
      sessionStorage.setItem('categories', null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem('categories')) {
      getCategories();
    } else {
      setCategories(JSON.parse(sessionStorage.getItem('categories')));
    }
  }, []);

  return (
    <List>
      <ListItem>
        <Link href="/" underline="none" variant="inherit">
          {t('home:site_name')}
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
        {t('sidebar:discover')}
      </Typography>
      {loading ? (
        <LoadingCircularIndeterminate />
      ) : categories ? (
        categories.map((category) => (
          <CustomListItemButton
            key={category._id}
            selected={setSelectedLink(`/category/${category._id}`)}
            onClick={() => handleLinkClick(`/category/${category._id}`)}
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
          {t('message:no_categories')}
        </Typography>
      )}
    </List>
  );
}

export default DrawerList;
