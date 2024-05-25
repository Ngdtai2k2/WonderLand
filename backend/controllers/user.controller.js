const mongoose = require("mongoose");

const userModel = require("../models/user.model");
const friendsModel = require("../models/friends.model");

const uploadMediaCloudinary = require("./uploadMediaCloudinary.controller");
const mediaController = require("./media.controller");
const optionsPaginate = require("../configs/optionsPaginate");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const options = optionsPaginate(req, "-password -isAdmin");
      const users = await userModel.paginate({}, options);

      return res.status(200).json({ users });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  deleteUserById: async (req, res) => {
    try {
      const user = await userModel.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      return res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  findUserById: async (req, res) => {
    try {
      const { user } = req.params;
      const { request_user } = req.query;

      let userData;
      if (mongoose.Types.ObjectId.isValid(user)) {
        userData = await userModel
          .findOne({ _id: user })
          .select("-password -isAdmin -email")
          .populate("media");
      } else {
        userData = await userModel
          .findOne({ nickname: user })
          .select("-password -isAdmin -email")
          .populate("media");
      }
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
      const friend = await friendsModel.findOne({
        user: request_user,
        friend: userData._id,
      });

      let hasSendRequestAddFriend;
      let isFriend = false;

      if (friend) {
        hasSendRequestAddFriend = true;
      } else {
        hasSendRequestAddFriend = false;
      }

      const friendRequest = await friendsModel.findOne({
        $or: [
          { user: userData._id, friend: request_user },
          { user: request_user, friend: userData._id },
        ],
      });

      if (friendRequest && friendRequest.status === 1) {
        isFriend = true;
      }

      return res.status(200).json({
        user: userData,
        hasSendRequestAddFriend,
        isFriend,
        friendRequest,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  updateUserById: async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id).populate("media");

      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      if (req.body.email && req.body.email !== user.email) {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).json({ message: "Email already exists!" });
        }
      }

      if (req.body.nickname && req.body.nickname !== user.nickname) {
        const existingUser = await userModel.findOne({
          nickname: req.body.nickname,
        });
        if (existingUser) {
          return res.status(400).json({ message: "Nickname already exists!" });
        }
      }

      if (req.file) {
        const media = user?.media;
        if (media) {
          if (
            !(await mediaController.deleteMedia(req, res, media._id)) ||
            !(await uploadMediaCloudinary.deleteFile(media.cloudinary_id))
          ) {
            return res
              .status(400)
              .json({ message: "An error occurred, please try again later!" });
          }
        }

        const data = await uploadMediaCloudinary.uploadImage(req, res);
        if (data === null) {
          return res.status(400).json({ message: "Image not uploaded!" });
        }

        user.media = data._id;
      }

      const userUpdate = await userModel
        .findByIdAndUpdate(
          req.params.id,
          req.file ? { $set: { ...req.body, media: user.media } } : req.body,
          { new: true }
        )
        .select("-password -isAdmin")
        .populate("media");

      return res
        .status(200)
        .json({ user: userUpdate, message: "Successful update profile!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  countUser: async (req, res) => {
    try {
      const total = await userModel.countDocuments();
      return res.status(200).json({ total });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
  getNewUser: async (req, res) => {
    try {
      const options = optionsPaginate(req, "-password");
      const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const users = await userModel.paginate(
        { createdAt: { $gte: startOfToday, $lt: endOfToday } },
        options
      );
      return res.status(200).json({ users });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
};

module.exports = userController;
