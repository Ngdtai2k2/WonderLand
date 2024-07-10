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
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  deleteUserById: async (req, res) => {
    try {
      const user = await userModel.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: req.t("not_found.user") });
      }
      return res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  findUserById: async (req, res) => {
    try {
      const { user } = req.params;
      const { request_user } = req.body;

      let userData;
      if (mongoose.Types.ObjectId.isValid(user)) {
        userData = await userModel
          .findOne({ _id: user })
          .select("-password -isAdmin -email -amount")
          .populate("media")
          .populate("coverArt");
      } else {
        userData = await userModel
          .findOne({ nickname: user })
          .select("-password -isAdmin -email -amount")
          .populate("media")
          .populate("coverArt");
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
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  updateUserById: async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id).populate("media");

      if (!user) {
        return res.status(404).json({ message: req.t("not_found.user") });
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
            return res.status(400).json({ message: req.t("server_error") });
          }
        }

        const data = await uploadMediaCloudinary.uploadImage(
          req,
          res,
          "profile"
        );
        if (data === null) {
          return res
            .status(400)
            .json({ message: req.t("file.image_not_upload") });
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
        .json({ user: userUpdate, message: req.t("user.success_update") });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  countUser: async (req, res) => {
    try {
      const total = await userModel.countDocuments();
      return res.status(200).json({ total });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
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
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  updateMediaProfile: async (req, res) => {
    try {
      const { request_user } = req.query;
      const { type } = req.body;

      const user = await userModel
        .findById(request_user)
        .populate("coverArt")
        .populate("media");

      if (!user) {
        return res.status(404).json({ message: req.t("not_found.user") });
      }

      let targetData;
      if (req.file) {
        targetData = Number(type) === 1 ? user.coverArt : user.media;

        if (targetData) {
          if (
            !(await mediaController.deleteMedia(req, res, targetData._id)) ||
            !(await uploadMediaCloudinary.deleteFile(targetData.cloudinary_id))
          ) {
            return res.status(400).json({ message: req.t("server_error") });
          }
        }
        const data = await uploadMediaCloudinary.uploadImage(
          req,
          res,
          "profile"
        );
        if (data === null) {
          return res
            .status(400)
            .json({ message: req.t("file.image_not_upload") });
        }
        Number(type) === 1
          ? (user.coverArt = data._id)
          : (user.media = data._id);
        await user.save();

        const userUpdated = await userModel
          .findById(user._id)
          .populate("coverArt")
          .populate("media");

        return res.status(200).json({
          user: userUpdated,
          message:
            Number(type) === 1
              ? req.t("user.change_cover_art")
              : req.t("user.change_avatar"),
        });
      }
      return res.status(400).json({ message: req.t("file.required") });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
  getBalanceByUser: async (req, res) => {
    try {
      const { request_user } = req.query;
      const user = await userModel.findById(request_user).select("amount");
      if (!user) {
        return res.status(404).json({ message: req.t("not_found.user") });
      }
      return res.status(200).json({ balance: user.amount });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
};

module.exports = userController;
