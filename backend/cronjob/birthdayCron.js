const cron = require("node-cron");
const moment = require("moment-timezone");

const userModel = require("../models/user.model");
const userSocketModel = require("../models/userSocket.model");
const notificationService = require("../services/notification.service");

// May vary according to the time zone of the user in the client
const timezone = "Asia/Ho_Chi_Minh";

// cron job on 0h 0m every day
cron.schedule("0 0 * * *", async () => {
  try {
    const today = moment().tz(timezone).startOf("day");
    const todayMonthDay = today.format("MM-DD");

    const users = await userModel.find({
      // $expr is an operator in MongoDB that allows you to use aggregation framework expressions
      $expr: {
        // Check if a user's birthday is equal to the current date
        $eq: [
          {
            $dateToString: {
              format: "%m-%d",
              date: "$birthday",
              timezone: timezone,
            },
          },
          todayMonthDay,
        ],
      },
    });

    let userSockets = [];
    let notification;

    if (users.length > 0) {
      // get socket
      userSockets = await userSocketModel.find({
        user: { $in: users.map((user) => user._id) },
      });

      // push notification for user
      users.forEach(async (user) => {
        notification = await notificationService.createNotification(
          user._id,
          // 5 - server notification
          5,
          null,
          null,
          `Today is your birthday, have a wonderful day!!!`,
          "https://img.upanh.tv/2024/05/27/OIG3.jpg"
        );
      });
    }

    // emit socket notification
    if (userSockets.length > 0) {
      userSockets.forEach(async (socket) => {
        global._io
          .to(socket.socketId)
          .emit(
            "msg-your-birthday",
            `Today is your birthday, have a wonderful day!!!`,
            notification
          );
      });
    }
  } catch (e) {
    console.error("An error occurred!");
  }
});
