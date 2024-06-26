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
      messages: message,
      image: image,
    };

    if (targetField) {
      notificationData[targetField] = targetId;
    }
    const notification = await notificationModel.create(notificationData);

    if (!notification) {
      return res.status(500).json({ message: req.t("server_error") });
    }
    return notification;
  },
};

module.exports = notificationService;
