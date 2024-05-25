import React, { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import TabContext from '@mui/lab/TabContext';

import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import CakeRoundedIcon from '@mui/icons-material/CakeRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';

import FriendsListTab from './friendsListTab';
import CustomBox from '../../components/CustomBox';
import { ButtonTab } from '../styles';

export default function FriendsList() {
  const [tabIndex, setTabIndex] = useState(0);

  const theme = useTheme();
  const isSmOrBelow = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <CustomBox>
      <TabContext value={tabIndex}>
        <Box sx={{ marginY: 2, ...(isSmOrBelow ? null : { display: 'flex' }) }}>
          <Tabs
            value={tabIndex}
            onChange={handleChangeTab}
            variant={isSmOrBelow ? 'scrollable' : 'standard'}
            orientation={isSmOrBelow ? 'horizontal' : 'vertical'}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <ButtonTab
              label={
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                >
                  <Diversity3RoundedIcon />
                  <Typography variant="body1">Friends list</Typography>
                </Box>
              }
            />
            <ButtonTab
              label={
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                >
                  <GroupAddRoundedIcon />
                  <Typography variant="body1">Friends request</Typography>
                </Box>
              }
            />
            <ButtonTab
              label={
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                >
                  <CakeRoundedIcon />
                  <Typography variant="body1">Birthday</Typography>
                </Box>
              }
            />
          </Tabs>
          <Box
            sx={{
              ...(isSmOrBelow
                ? { marginTop: 3, width: '100%' }
                : { marginLeft: 3, width: '65%' }),
            }}
          >
            {tabIndex === 0 && <FriendsListTab />}
          </Box>
        </Box>
      </TabContext>
    </CustomBox>
  );
}
