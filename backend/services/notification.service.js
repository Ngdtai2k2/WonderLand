const notificationModel = require("../models/notification.model");

const notificationService = {
  createNotification: async (
    recipient,
    type,
    targetField,
    targetId,
    message,
    image
  ) => {
    const notification = await notificationModel.create({
      recipient: recipient,
      type: type,
      read: false,
      [targetField]: targetId,
      message: message,
      image: image
    });
    if (!notification) {
      return res
        .status(500)
        .json({ message: "An error occurred, please try again later!" });
    }
    return notification;
  },
};

module.exports = notificationService;
