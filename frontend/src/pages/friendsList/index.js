import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';

import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import CakeRoundedIcon from '@mui/icons-material/CakeRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';

import FriendsListTab from './friendsListTab';
import CustomBox from '../../components/CustomBox';
import FriendsRequestListTab from './friendsRequestListTab';
import { ButtonTab } from '../styles';
import { BoxSpaceBetween } from './styles';
import { getQueryString } from '../../utils/helperFunction';

export default function FriendsList() {
  const [tabIndex, setTabIndex] = useState(0);

  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation(['friends']);
  const isSmOrBelow = useMediaQuery(theme.breakpoints.down('sm'));

  const tab_index = Number(getQueryString('tab_index'));

  useEffect(() => {
    setTabIndex(tab_index);
  }, [tab_index]);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
    navigate(`?tab_index=${newValue}`, {
      replace: true,
    });
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
                <BoxSpaceBetween>
                  <Diversity3RoundedIcon />
                  <Typography variant="body1">
                    {t('friends:friends_list')}
                  </Typography>
                </BoxSpaceBetween>
              }
            />
            <ButtonTab
              label={
                <BoxSpaceBetween>
                  <GroupAddRoundedIcon />
                  <Typography variant="body1">
                    {t('friends:friends_request_list')}
                  </Typography>
                </BoxSpaceBetween>
              }
            />
            <ButtonTab
              label={
                <BoxSpaceBetween>
                  <CakeRoundedIcon />
                  <Typography variant="body1">Birthday</Typography>
                </BoxSpaceBetween>
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
            {tabIndex === 1 && <FriendsRequestListTab />}
          </Box>
        </Box>
      </TabContext>
    </CustomBox>
  );
}
