import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import TabContext from '@mui/lab/TabContext';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';

import useUserAxios from '../../hooks/useUserAxios';
import CustomBox from '../../components/CustomBox';
import ChangePassword from './changePassword';
import Account from './account';
import Profile from './profile';

import { ButtonTab, TypographyButtonTab } from '../styles';

export default function Settings() {
  const [tabIndex, setTabIndex] = useState(0);

  const theme = useTheme();
  const { t, i18n } = useTranslation(['settings']);
  const isSmOrBelow = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useUserAxios(i18n.language);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    document.title = user?.nickname
      ? `${user.nickname}'s settings`
      : 'Page Not Found';
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
                    {t('settings:account')}
                  </TypographyButtonTab>
                }
              />
              <ButtonTab
                label={
                  <TypographyButtonTab gap={1}>
                    <VpnKeyRoundedIcon />
                    {t('settings:password')}
                  </TypographyButtonTab>
                }
              />
              <ButtonTab
                label={
                  <TypographyButtonTab gap={1}>
                    <DriveFileRenameOutlineRoundedIcon />
                    {t('settings:profile')}
                  </TypographyButtonTab>
                }
              />
              <ButtonTab
                label={
                  <TypographyButtonTab gap={1}>
                    <BlockRoundedIcon />
                    {t('settings:blocks')}
                  </TypographyButtonTab>
                }
              />
              <ButtonTab
                label={
                  <TypographyButtonTab gap={1}>
                    <SecurityRoundedIcon />
                    {t('settings:privacy')}
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
