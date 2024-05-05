const mongoose = require("mongoose");
const User = require("../models/user.model");
const uploadMediaCloudinary = require("./uploadMediaCloudinary.controller");
const mediaController = require("./media.controller");
const optionsPaginate = require("../configs/optionsPaginate");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const options = optionsPaginate(req, "-password -isAdmin");
      const users = await User.paginate({}, options);

      return res.status(200).json({ users });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  deleteUserById: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
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
      let user;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        user = await User.findOne({ _id: req.params.id })
          .select("-password -isAdmin")
          .populate("media");
      } else {
        user = await User.findOne({ nickname: req.params.id })
          .select("-password -isAdmin")
          .populate("media");
      }
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  updateUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate("media");

      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      if (req.body.email && req.body.email !== user.email) {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).json({ message: "Email already exists!" });
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

      const userUpdate = await User.findByIdAndUpdate(
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
      return res.status(500).json({ message: "Something went wrong!" });
    }
  },

  countUser: async (req, res) => {
    try {
      const total = await User.countDocuments();
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

      const users = await User.paginate(
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
