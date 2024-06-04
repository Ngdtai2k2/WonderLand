const cron = require("node-cron");
const moment = require("moment-timezone");

const userModel = require("../models/user.model");
const userSocketModel = require("../models/userSocket.model");
const friendsModel = require("../models/friends.model");

const notificationService = require("../services/notification.service");

// May vary according to the time zone of the user in the client
const timezone = "Asia/Ho_Chi_Minh";

// cron job on 0h 0m every day
cron.schedule("0 0 * * *", async () => {
  console.log("Cron job running...");
  try {
    const today = moment().tz(timezone).startOf("day");
    const todayMonthDay = today.format("MM-DD");

    const users = await userModel.aggregate([
      {
        $match: {
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
        },
      },
      {
        $group: {
          _id: "$_id",
          email: { $first: "$email" },
          fullname: { $first: "$fullname" },
          nickname: { $first: "$nickname" },
          birthday: { $first: "$birthday" },
        },
      },
    ]);

    let userSockets = [];
    let friendSockets = [];

    if (users.length > 0) {
      // get socket
      userSockets = await userSocketModel.find({
        user: { $in: users.map((user) => user._id) },
      });

      // push notification for user
      await Promise.all(
        users.map(async (user) => {
          const messages = {
            vi: "Hôm nay là sinh nhật bạn, chúc bạn sinh nhật vui vẻ!",
            en: "Today is your birthday, have a wonderful day!",
          };
          await notificationService.createNotification(
            user._id,
            5,
            "userId",
            user._id,
            messages,
            "https://img.upanh.tv/2024/05/27/OIG3.jpg"
          );
        })
      );

      for (const user of users) {
        const friends = await friendsModel.find({
          $and: [
            {
              $or: [{ user: user._id }, { friend: user._id }],
            },
            { status: 1 },
          ],
        });

        await Promise.all(
          friends.map(async (friend) => {
            const friendId = friend.user.equals(user._id)
              ? friend.friend
              : friend.user;

            const sockets = await userSocketModel.find({ user: friendId });
            friendSockets.push(...sockets);

            const messages = {
              vi: `Hôm nay là sinh nhật ${user.nickname}, hãy gửi là chúc của bạn!`,
              en: `Today is ${user.nickname}'s birthday, send your wishes now!`,
            };

            // push notification for friend with the name of the birthday user
            await notificationService.createNotification(
              friendId,
              5,
              "userId",
              user._id,
              messages,
              "https://img.upanh.tv/2024/05/27/OIG3.jpg"
            );
          })
        );
      }
    }

    // emit socket notification
    if (userSockets.length > 0) {
      userSockets.forEach(async (socket) => {
        global._io
          .to(socket.socketId)
          .emit(
            "msg-your-birthday",
            `Today is your birthday, have a wonderful day!!!`,
            socket
          );
      });
    }

    if (friendSockets.length > 0) {
      friendSockets.forEach(async (socket) => {
        global._io
          .to(socket.socketId)
          .emit(
            "msg-friend-birthday",
            `Today is your friend's birthday, send your wishes now!`,
            1
          );
      });
    }

    console.log("Cron job completed!");
  } catch (e) {
    console.error("An error occurred!");
    console.log("Cron job completed!");
  }
});
