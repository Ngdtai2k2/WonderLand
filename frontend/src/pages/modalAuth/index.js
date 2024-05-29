import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import UndoRoundedIcon from '@mui/icons-material/UndoRounded';

import Login from './login';
import Register from './register';
import ForgetPassword from './forgetPassword';
import ResetPassword from './resetPassword';

import { BoxStyle, LeftAlignLink } from './styles';

export default function ModalAuth({ openModal, handleCloseModal }) {
  const [tabIndex, setTabIndex] = useState(0);

  const { t } = useTranslation(['auth']);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal auth"
      aria-describedby="login and signup"
    >
      <BoxStyle
        bgcolor="background.paper"
        width={{
          xs: '95%',
          md: '45%',
        }}
      >
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
            <Tab sx={{ fontSize: '16px' }} label={t('auth:sign_in')} />
            <Tab sx={{ fontSize: '16px' }} label={t('auth:sign_up')} />
            <Tab sx={{ display: 'none' }} />
            <Tab sx={{ display: 'none' }} />
          </Tabs>
          <LeftAlignLink href="/">
            <Typography
              variant="caption"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <UndoRoundedIcon sx={{ fontSize: '15px', marginRight: 0.3 }} />
              {t('auth:back_to_home')}
            </Typography>
          </LeftAlignLink>
          {tabIndex === 0 && <Login setTabIndex={setTabIndex} />}
          {tabIndex === 1 && <Register setTabIndex={setTabIndex} />}
          {tabIndex === 2 && <ForgetPassword setTabIndex={setTabIndex} />}
          {tabIndex === 3 && <ResetPassword setTabIndex={setTabIndex} />}
        </TabContext>
      </BoxStyle>
    </Modal>
  );
}
