import React, { useEffect, useRef, useState } from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import CelebrationRoundedIcon from '@mui/icons-material/CelebrationRounded';

import { getCurrentDate } from '../../utils/helperFunction';
import useUserAxios from '../../hooks/useUserAxios';
import { initializeSocket } from '../../sockets/initializeSocket';
import { getNotificationByUserId } from '../../utils/notificationServices';

export default function WidgetBirthday() {
  const [msgYourBirthday, setMsgYourBirthday] = useState(null);
  const [event, setEvent] = useState();
  const [notifications, setNotifications] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [hasMore, setHasMore] = useState(true);

  const page = useRef(1);
  const { user, accessToken, axiosJWT } = useUserAxios();

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

  useEffect(() => {
    page.current = 1;
    if (user) {
      getNotificationByUserId(
        setNotifications,
        notifications,
        setHasMore,
        page,
        user?._id,
        accessToken,
        axiosJWT,
        5,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  console.log(notifications);

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
      <Box marginTop={1}>
        {msgYourBirthday ? (
          <Typography variant="body2">{msgYourBirthday}</Typography>
        ) : notifications && notifications.length > 0 ? (
          notifications.slice(0, 2).map((item) => (
            <Typography variant="body2" key={item._id}>
              {item.message}
            </Typography>
          ))
        ) : (
          'No events today!'
        )}
      </Box>
    </>
  );
}
