import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (userId) => {
  if (!socket) {
    socket = io(process.env.REACT_APP_SERVER_URL, {
      query: {
        userId: userId,
      },
    });

    socket.on('connect', () => {
      console.log('%c⚡SOCKET ON!⚡', 'color: yellow; font-size: 20px');
    });

    return socket;
  }

  return socket;
};

export const handleSocketEvents = (socket, setEvent, isAdmin) => {
  socket.on('msg-action-reaction', (msg, notification) => {
    setEvent(notification._id);
  });

  socket.on('msg-action-removed-reaction', (msg, deleteReaction) => {
    setEvent(deleteReaction._id);
  });

  if (isAdmin) {
    socket.on('report-for-admin', (msg, notification) => {
      setEvent(notification._id);
    });
  }

  socket.on('action-delete-post', (msg, notification) => {
    setEvent(notification._id);
  });

  socket.on('report-refused', (msg, notification) => {
    setEvent(notification._id);
  });
};
