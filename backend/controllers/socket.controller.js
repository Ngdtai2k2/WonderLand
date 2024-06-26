const userSocketModel = require("../models/userSocket.model");

const socketController = {
  checkOnline: async (req, res) => {
    try {
      const { userIds } = req.body;
      const userSockets = await userSocketModel
        .find({ user: { $in: userIds } })
        .exec();

      const onlineUserIds = userSockets.map((userSocket) =>
        userSocket.user.toString()
      );

      const onlineUsers = userIds.filter((userId) =>
        onlineUserIds.includes(userId.toString())
      );
      const offlineUsers = userIds.filter(
        (userId) => !onlineUserIds.includes(userId.toString())
      );

      res.status(200).json({
        online: onlineUsers,
        offline: offlineUsers,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: req.t('server_error') });
    }
  },

  checkOnlineByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const userSockets = await userSocketModel.find({ user: userId }).exec();

      const onlineUserIds = userSockets.map((userSocket) =>
        userSocket.user.toString()
      );

      const online = onlineUserIds.includes(userId.toString());

      res.status(200).json({ online });
    } catch (error) {
      return res
        .status(500)
        .json({ message: req.t('server_error') });
    }
  },
};

module.exports = socketController;
