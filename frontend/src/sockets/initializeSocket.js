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
  const registerEvent = (event, handler) => {
    socket.on(event, (msg, data) => handler(data));
  };

  const events = [
    'msg-action-reaction',
    'msg-action-removed-reaction',
    'action-delete-post',
    'report-refused',
    'msg-friend-request',
    'msg-your-birthday',
    'msg-friend-birthday',
    'category-new-article',
  ];

  events.forEach((event) => {
    registerEvent(event, (data) => setEvent(data._id));
  });

  if (isAdmin) {
    registerEvent('report-for-admin', (data) => setEvent(data._id));
  }

  registerEvent('msg-socket-connected', (data) =>
    setTimeout(() => {
      setEvent(data);
    }, 1000),
  );

  registerEvent('msg-friend-birthday', (data) => setEvent(data));
};
