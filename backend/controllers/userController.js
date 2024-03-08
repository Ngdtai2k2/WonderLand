const User = require("../models/User");
const mongoose = require("mongoose");

const uploadMediaController = require("./uploadMediaController");
const mediaController = require("./mediaController");
const createOptions = require("./createOptions");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const options = createOptions(req, "-password -isAdmin");
      const users = await User.paginate({}, options);

      return res.status(200).json({ users });
    } catch (error) {
      return res.status(500).json({ error: error.message });
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
      return res.status(500).json({ error: error.message });
    }
  },

  findUserById: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ message: "User not found!" });
      }
      const user = await User.findById(req.params.id)
        .select("-password -isAdmin")
        .populate("media");
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  updateUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate("media");

      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      if (req.file) {
        const media = user?.media;
        if (media) {
          if (
            !(await mediaController.deleteMedia(req, res, media._id)) ||
            !(await uploadMediaController.deleteFile(media.cloudinary_id))
          ) {
            return res
              .status(400)
              .json({ message: "An error occurred, please try again later!" });
          }
        }

        const data = await uploadMediaController.uploadImage(req, res);
        if (data === null) {
          return res.status(400).json({ message: "Image not uploaded!" });
        }

        user.media = data._id;
      }

      const userUpdate = await User.findByIdAndUpdate(
        req.params.id,
        req.file ? { $set: { ...req.body, media: user.media } } : req.body,
        { new: true }
      ).select("-password -isAdmin").populate("media");

      return res
        .status(200)
        .json({ user: userUpdate, message: "Successful update profile!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = userController;
