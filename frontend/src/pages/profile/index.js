import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import TabContext from '@mui/lab/TabContext';

import CustomBox from '../../components/CustomBox';
import NotFound from '../../components/NotFound';
import LoadingCircularIndeterminate from '../../components/Loading';
import { BaseApi } from '../../constants/constant';

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
        setLoading(true);
        const response = await axios.get(`${BaseApi}/v1/user/${id}`);
        setData(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
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

  if (!user && loading) {
    return <NotFound />;
  }

  return loading ? (
    <LoadingCircularIndeterminate />
  ) : (
    <CustomBox>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" marginY={1}>
          <Avatar
            src={user?.media?.url}
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
