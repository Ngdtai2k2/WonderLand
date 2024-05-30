import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import AskTab from './askTab';
import PostTab from './postTab';
import CustomBox from '../../components/CustomBox';
import Rules from '../../components/Rules';

export default function CreatePost() {
  const [tabIndex, setTabIndex] = useState(0);

  const { t } = useTranslation(['post']);

  useEffect(() => {
    document.title = t('post:create.title');
  }, [t]);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };
  return (
    <CustomBox marginX={{ xs: 0, md: 4 }}>
      <Typography variant="h5" fontWeight={700} textAlign="center">
        {t('post:create.title')}
      </Typography>
      <Grid container spacing={1} marginTop={2}>
        <Grid item xs={12} sm={8}>
          <Paper variant="outlined" sx={{ paddingX: 2, paddingY: 1 }}>
            <TabContext value={tabIndex}>
              <Tabs
                value={tabIndex}
                onChange={handleChangeTab}
                variant="standard"
                centered={true}
                sx={{
                  marginBottom: 2,
                }}
              >
                <Tab sx={{ fontSize: '16px' }} label={t('post:create.post')} />
                <Tab sx={{ fontSize: '16px' }} label={t('post:create.ask')} />
              </Tabs>
              {tabIndex === 0 && <PostTab />}
              {tabIndex === 1 && <AskTab />}
            </TabContext>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4} marginBottom={2}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Rules />
          </Paper>
        </Grid>
      </Grid>
    </CustomBox>
  );
}
