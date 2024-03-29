import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import React, { useEffect, useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';

import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';

import ChangePassword from './changePassword';
import CustomBox from '../../components/CustomBox';
import Account from './account';
import Profile from './profile';

import { ButtonTab, TypographyButtonTab } from '../styles';
import { useSelector } from 'react-redux';

export default function Settings() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };
  const theme = useTheme();
  const isSmOrBelow = useMediaQuery(theme.breakpoints.down('sm'));
  const user = useSelector((state) => state.auth.login?.currentUser);
  
  useEffect(() => {
    document.title = `${user?.fullname}'s settings`;
  }, [user]);

  return (
    <CustomBox>
      <Paper
        variant="outlined"
        sx={{
          paddingTop: {
            xs: 0,
            md: 2,
          },
          paddingX: 2,
          paddingBottom: 2,
        }}
      >
        <TabContext value={tabIndex}>
          <Box
            sx={{ marginY: 2, ...(isSmOrBelow ? null : { display: 'flex' }) }}
          >
            <Tabs
              value={tabIndex}
              onChange={handleChangeTab}
              variant={isSmOrBelow ? 'scrollable' : 'standard'}
              orientation={isSmOrBelow ? 'horizontal' : 'vertical'}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <ButtonTab
                label={
                  <TypographyButtonTab gap={1}>
                    <AccountCircleIcon />
                    Account
                  </TypographyButtonTab>
                }
              />
              <ButtonTab
                label={
                  <TypographyButtonTab gap={1}>
                    <VpnKeyRoundedIcon />
                    Password
                  </TypographyButtonTab>
                }
              />
              <ButtonTab
                label={
                  <TypographyButtonTab gap={1}>
                    <DriveFileRenameOutlineRoundedIcon />
                    Profile
                  </TypographyButtonTab>
                }
              />
              <ButtonTab
                label={
                  <TypographyButtonTab gap={1}>
                    <BlockRoundedIcon />
                    Blocks
                  </TypographyButtonTab>
                }
              />
              <ButtonTab
                label={
                  <TypographyButtonTab gap={1}>
                    <SecurityRoundedIcon />
                    Privacy
                  </TypographyButtonTab>
                }
              />
            </Tabs>
            <Box
              sx={{
                ...(isSmOrBelow
                  ? { marginTop: 3, width: '100%' }
                  : { marginLeft: 3, width: '77%' }),
              }}
            >
              {tabIndex === 0 && <Account />}
              {tabIndex === 1 && <ChangePassword />}
              {tabIndex === 2 && <Profile />}
              {tabIndex === 3 && <div>Tab4</div>}
              {tabIndex === 4 && <div>Tab5</div>}
            </Box>
          </Box>
        </TabContext>
      </Paper>
    </CustomBox>
  );
}
