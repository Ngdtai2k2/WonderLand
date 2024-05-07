import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import AskTab from './askTab';
import PostTab from './postTab';
import CustomBox from '../../components/CustomBox';

export default function CreatePost() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };
  return (
    <CustomBox marginX={{ xs: 0, md: 4 }}>
      <Typography variant="h5" fontWeight={700} textAlign="center">
        Create Post
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
                <Tab sx={{ fontSize: '16px' }} label="Post" />
                <Tab sx={{ fontSize: '16px' }} label="Ask" />
              </Tabs>
              {tabIndex === 0 && <PostTab />}
              {tabIndex === 1 && <AskTab />}
            </TabContext>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ paddingX: 2, paddingBottom: 2 }}>
            heheeh
          </Paper>
        </Grid>
      </Grid>
    </CustomBox>
  );
}
