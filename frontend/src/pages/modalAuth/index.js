import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Modal from '@mui/material/Modal';

import Login from './login';
import Register from './register';
import ForgetPassword from './forgetPassword';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 1,
};

export default function ModalAuth({ openModal, handleCloseModal }) {
  const [tabIndex, setTabIndex] = useState(0);

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
      <Box
        sx={style}
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
            <Tab sx={{ fontSize: '16px' }} label="Login" />
            <Tab sx={{ fontSize: '16px' }} label="Sign Up" />
          </Tabs>
          {tabIndex === 0 && <Login setTabIndex={setTabIndex} />}
          {tabIndex === 1 && <Register setTabIndex={setTabIndex} />}
          {tabIndex === 2 && <ForgetPassword setTabIndex={setTabIndex} />}
        </TabContext>
      </Box>
    </Modal>
  );
}
