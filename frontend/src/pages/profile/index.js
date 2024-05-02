import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import moment from 'moment';

import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import TabContext from '@mui/lab/TabContext';
import Divider from '@mui/material/Divider';

import AddReactionRoundedIcon from '@mui/icons-material/AddReactionRounded';
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';

import CustomBox from '../../components/CustomBox';
import NotFound from '../../components/NotFound';
import LoadingCircularIndeterminate from '../../components/Loading';
import PostTab from './postTab';
import { BaseApi, useToastTheme } from '../../constants/constant';
import { ButtonTab, TypographyButtonTab } from '../styles';
import ReactionTab from './reactionTab';
import SavedPostTab from './savedPostTab';

export default function Profile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const theme = useTheme();
  const toastTheme = useToastTheme();
  const isSmOrBelow = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BaseApi}/user/${id}`);
        setData(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setData(null);
          toast.error('Cannot find data!', toastTheme);
        } else {
          toast.error('Something went wrong!', toastTheme);
        }
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const user = data?.user;

  useEffect(() => {
    document.title = user && `${user?.fullname}'s profile`;
  }, [user?.fullname, user]);

  if (!user && !loading) {
    return <NotFound />;
  }

  return loading ? (
    <LoadingCircularIndeterminate />
  ) : (
    <CustomBox>
      <Paper
        variant="outlined"
        sx={{
          p: {
            xs: 1,
            md: 2,
          },
        }}
      >
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
        <Divider sx={{ marginY: 2 }} />
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
                    <AddReactionRoundedIcon />
                    Reactions
                  </TypographyButtonTab>
                }
              />
              <ButtonTab
                label={
                  <TypographyButtonTab gap={1}>
                    <PostAddRoundedIcon />
                    Posts
                  </TypographyButtonTab>
                }
              />
              <ButtonTab
                label={
                  <TypographyButtonTab gap={1}>
                    <CommentRoundedIcon />
                    Comments
                  </TypographyButtonTab>
                }
              />
              <ButtonTab
                label={
                  <TypographyButtonTab gap={1}>
                    <StarsRoundedIcon />
                    Saved
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
              {tabIndex === 0 && <ReactionTab />}
              {tabIndex === 1 && <PostTab />}
              {tabIndex === 2 && <div>Tab3</div>}
              {tabIndex === 3 && <SavedPostTab />}
            </Box>
          </Box>
        </TabContext>
      </Paper>
    </CustomBox>
  );
}
