import { useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import Box from '@mui/material/Box';
import moment from 'moment';
import Paper from '@mui/material/Paper';
import React, { useEffect, useState } from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import CustomBox from '../../components/CustomBox';
import NotFound from '../../components/NotFound';

export default function Profile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await axios.get(`/v1/user/${id}`);
        setData(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error('User not found:', error);
          setData(null);
        } else {
          console.error('Error fetching data:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, [id]);

  const user = data?.user;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data || user === null) {
    return <NotFound />;
  }

  return (
    <CustomBox>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" marginY={1}>
          <Avatar
            src={user?.avatar}
            alt={'Avatar of' + user?.fullname}
            sx={{ width: 60, height: 60 }}
          />
          <Box marginLeft={1}>
            <Typography
              variant="h6"
              fontWeight={600}
              display="flex"
              alignItems="flex-start"
            >
              {user?.fullname}
            </Typography>

            <Typography variant="caption">
              Joined {moment(user?.createdAt).fromNow()}
            </Typography>
          </Box>
        </Box>
        <Typography variant="h6">{user?.about}</Typography>
        <TabContext value={tabIndex}>
          <Box sx={{ width: '100%', marginY: 2 }}>
            <Tabs
              value={tabIndex}
              onChange={handleChangeTab}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab sx={{ fontSize: '14px' }} label="Reactions" />
              <Tab sx={{ fontSize: '14px' }} label="Posts" />
              <Tab sx={{ fontSize: '14px' }} label="Comments" />
              <Tab sx={{ fontSize: '14px' }} label="Saved" />
            </Tabs>
          </Box>
          <Box>
            {tabIndex === 0 && <div>Tab1</div>}
            {tabIndex === 1 && <div>Tab2</div>}
            {tabIndex === 2 && <div>Tab3</div>}
            {tabIndex === 3 && <div>Tab4</div>}
          </Box>
        </TabContext>
      </Paper>
    </CustomBox>
  );
}
