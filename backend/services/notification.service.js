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
    let notificationData = {
      recipient: recipient,
      type: type,
      read: false,
      message: message,
      image: image,
    };

    if (targetField) {
      notificationData[targetField] = targetId;
    }
    const notification = await notificationModel.create(notificationData);
    
    if (!notification) {
      return res
        .status(500)
        .json({ message: "An error occurred, please try again later!" });
    }
    return notification;
  },
};

module.exports = notificationService;
