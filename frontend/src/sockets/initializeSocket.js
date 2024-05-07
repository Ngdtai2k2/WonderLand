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
      console.info('⚡⚡⚡⚡⚡⚡⚡');
    });

    return socket;
  }

  return socket;
};
