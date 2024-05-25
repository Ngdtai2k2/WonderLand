const friendsModel = require("../models/friends.model");
const userModel = require("../models/user.model");
const userSocketModel = require("../models/userSocket.model");
const notificationsModel = require("../models/notification.model");

const notificationService = require("../services/notification.service");

const optionsPaginate = require("../configs/optionsPaginate");

const friendsController = {
  request: async (req, res) => {
    try {
      const { userId, friendId } = req.body;

      if (userId == friendId) {
        return res
          .status(400)
          .json({ message: "You can't add yourself as a friend!" });
      }

      const user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found!" });
      const friend = await userModel.findById(friendId);
      if (!friend) return res.status(404).json({ message: "User not found!" });
      const userRequestAddFriend = await friendsModel.findOne({
        user: userId,
        friend: friendId,
      });
      if (userRequestAddFriend) {
        return res
          .status(400)
          .json({ message: "You have already sent a friend request!" });
      }

      const newFriendRequest = new friendsModel({
        user: userId,
        friend: friendId,
        status: 0,
      });
      await newFriendRequest.save();

      const notification = await notificationService.createNotification(
        friendId,
        4,
        "userId",
        userId,
        `You have a new friend request from ${user.nickname}`,
        "https://img.upanh.tv/2024/05/24/bxmvqd8o.png"
      );

      const userSocket = await userSocketModel.find({ user: friend._id });
      if (userSocket.length > 0) {
        userSocket.forEach(async (socket) => {
          global._io
            .to(socket.socketId)
            .emit(
              "msg-friend-request",
              `${user.nickname} has sent you a friend request!`,
              notification
            );
        });
      }

      return res
        .status(201)
        .json({ message: "Friend requests have been sent!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  cancelRequest: async (req, res) => {
    try {
      const { userId, friendId } = req.body;

      const user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found!" });

      const friend = await userModel.findById(friendId);
      if (!friend) return res.status(404).json({ message: "User not found!" });

      const friendRequest = await friendsModel.findOne({
        $or: [
          { user: userId, friend: friendId },
          { user: friendId, friend: userId },
        ],
      });

      if (friendRequest && friendRequest.status === 1) {
        return res
          .status(400)
          .json({ message: "You two have become friends 😍!" });
      }

      const userRequestAddFriend = await friendsModel.deleteMany({
        user: userId,
        friend: friendId,
      });

      if (!userRequestAddFriend) {
        return res
          .status(400)
          .json({ message: "You have not sent a friend request!" });
      }

      await notificationsModel.deleteMany({
        recipient: friendId,
        userId: userId,
        type: 4,
      });
      return res
        .status(200)
        .json({ message: "Successfully cancel your friend request!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  acceptRequest: async (req, res) => {
    try {
      const { userId, friendId } = req.body;
      const user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found!" });
      const friend = await userModel.findById(friendId);
      if (!friend) return res.status(404).json({ message: "User not found!" });

      let friendData = await friendsModel.findOne({
        user: userId,
        friend: friendId,
      });

      if (!friendData) {
        return res
          .status(400)
          .json({ message: "You have not sent a friend request!" });
      }

      friendData.status = 1;
      await friendData.save();

      return res
        .status(200)
        .json({ message: "You two have become friends 😍!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  deleteFriend: async (req, res) => {
    try {
      const { userId, friendId } = req.body;

      const user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found!" });
      const friend = await userModel.findById(friendId);
      if (!friend) return res.status(404).json({ message: "User not found!" });

      const friendRequest = await friendsModel.findOne({
        $or: [
          { user: userId, friend: friendId },
          { user: friendId, friend: userId },
        ],
      });

      if (!friendRequest) {
        return res
          .status(400)
          .json({ message: "You are not friends with this user!" });
      }

      // delete friend
      await friendsModel.deleteMany({
        $or: [
          { user: userId, friend: friendId },
          { user: friendId, friend: userId },
        ],
      });

      // delete old notifications
      await notificationsModel.deleteMany({
        $or: [
          { userId: userId, recipient: friendId, type: 4 },
          { userId: friendId, recipient: userId, type: 4 },
        ],
      });

      return res.status(200).json({ message: "Separation is sad 😭x100!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  getFriendsList: async (req, res) => {
    try {
      const { id } = req.params;

      const options = optionsPaginate(req);

      const user = await userModel.findById(id);
      if (!user) return res.status(404).json({ message: "User not found!" });

      let friendsList = await friendsModel.paginate(
        {
          $or: [
            { user: id, status: 1 },
            { friend: id, status: 1 },
          ],
        },
        options
      );

      friendsList.docs = await Promise.all(
        friendsList.docs.map(async (friend) => {
          const friendId = friend.friend;
          const friendData = await userModel
            .findById(friendId == id ? friend.user : friendId)
            .select("-password -isAdmin -email")
            .populate({
              path: "media",
              select: "type url",
            });

          return friendData;
        })
      );

      return res.status(200).json(friendsList);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
};

module.exports = friendsController;
