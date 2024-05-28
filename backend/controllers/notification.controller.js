const moment = require("moment-timezone");

const optionsPaginate = require("../configs/optionsPaginate");

const notificationModel = require("../models/notification.model");
const userModel = require("../models/user.model");
const dotenv = require("dotenv");

dotenv.config();

const notificationController = {
  confirmRead: async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await notificationModel.findById(id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found!" });
      }
      notification.read = true;
      await notification.save();
      return res.status(200).json({ message: "Notification read!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  countUnreadNotifications: async (req, res) => {
    try {
      const { id } = req.body;
      const notifications = await notificationModel.find({
        recipient: id,
        read: false,
      });

      return res.status(200).json({ total: notifications.length });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  getNotificationByUserId: async (req, res) => {
    try {
      const { request_user, type } = req.query;

      const user = await userModel.findById(request_user);
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      const options = optionsPaginate(req);
      const query = { recipient: request_user };

      if (type) {
        const timeZone =  process.env.TIME_ZONE;
        const startOfDay = moment().tz(timeZone).startOf("day").toDate();
        const endOfDay = moment().tz(timeZone).endOf("day").toDate();

        query.type = { $in: type };
        query.createdAt = { $gte: startOfDay, $lte: endOfDay };
      }

      const notifications = await notificationModel.paginate(query, options);

      return res.status(200).json({ notifications });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
};

module.exports = notificationController;
