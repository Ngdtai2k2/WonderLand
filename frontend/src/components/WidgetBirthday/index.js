import React, { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import CelebrationRoundedIcon from '@mui/icons-material/CelebrationRounded';

import { getCurrentDate } from '../../utils/helperFunction';
import useUserAxios from '../../hooks/useUserAxios';
import { initializeSocket } from '../../sockets/initializeSocket';

export default function WidgetBirthday() {
  const [msgYourBirthday, setMsgYourBirthday] = useState(null);
  const [event, setEvent] = useState();

  const { user } = useUserAxios();

  const socket = initializeSocket(user?._id);

  socket.on('msg-your-birthday', (msg, data) => {
    const currentTime = new Date().getTime();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const remainingTime = endOfDay.getTime() - currentTime;

    // The lifetime period of the data is until the end of the day
    const dataWithExpiration = {
      data: JSON.stringify(msg),
      expirationTime: currentTime + remainingTime,
    };
    localStorage.setItem(
      'msg-your-birthday',
      JSON.stringify(dataWithExpiration),
    );
    setEvent(data?._id);
  });

  const storedData = localStorage.getItem('msg-your-birthday');

  useEffect(() => {
    if (storedData && user) {
      const { data, expirationTime } = JSON.parse(storedData);
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        localStorage.removeItem('msg-your-birthday');
      } else {
        setMsgYourBirthday(JSON.parse(data));
      }
    } else {
      setMsgYourBirthday(null);
    }
  }, [storedData, event, user]);

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body2" fontWeight={600} gap={0.2} display="flex">
          Birthday <CelebrationRoundedIcon sx={{ fontSize: 18 }} />
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {getCurrentDate()}
        </Typography>
      </Box>
      <Typography marginTop={1} variant="body2">
        {msgYourBirthday ? msgYourBirthday : `It's a dull day`}
      </Typography>
    </>
  );
}
