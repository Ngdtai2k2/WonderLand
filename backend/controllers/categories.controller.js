const mongoose = require("mongoose");

const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const categoriesModel = require("../models/categories.model");

const uploadMediaCloudinary = require("./uploadMediaCloudinary.controller");

const optionsPaginate = require("../configs/optionsPaginate");

const categoriesController = {
  create: async (req, res) => {
    try {
      let { name, description } = req.body;

      name = name.trim();
      description = description.trim();

      if (!name || !description) {
        return res
          .status(400)
          .json({ message: req.t("category.both_required") });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ message: req.t("category.contain_photo") });
      }

      const uniqueName = await categoriesModel.findOne({ name: name });

      if (uniqueName) {
        return res.status(400).json({ message: req.t("exists.category") });
      }

      let data;
      if (req.file.mimetype.startsWith("image/"))
        data = await uploadMediaCloudinary.uploadImage(req, res, "categories");
      else {
        return res.status(415).json({
          message: req.t("file.not_supported"),
        });
      }
      if (data === null) {
        return res
          .status(400)
          .json({ message: req.t("file.image_not_upload") });
      }

      const newCategory = new categoriesModel({
        name: name,
        description: description,
        media: req.file ? data._id : null,
      });

      const newData = await newCategory.save();
      res.status(201).json({
        message: req.t("category.created_success"),
        newCategory: newData,
      });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  updateCategory: async (req, res) => {
    try {
      let { name, description } = req.body;

      name = name.trim();
      description = description.trim();

      if (!name || !description) {
        return res
          .status(400)
          .json({ message: req.t("category.both_required") });
      }

      const uniqueName = await categoriesModel.findOne({ name: name });

      if (uniqueName) {
        return res.status(400).json({ message: req.t("exists.category") });
      }

      const id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: req.t("category.id_invalid") });
      }
      const category = await categoriesModel.findById(id).populate("media");
      if (!category) {
        return res.status(404).json({ message: req.t("not_found.category") });
      }

      if (req.file) {
        const deleteImage = await uploadMediaCloudinary.deleteFile(
          category.media.cloudinary_id
        );
        if (!deleteImage) {
          return res.status(400).json({ message: req.t("server_error") });
        }
        let data;

        if (req.file.mimetype.startsWith("image/"))
          data = await uploadMediaCloudinary.uploadImage(
            req,
            res,
            "categories"
          );
        else {
          return res.status(415).json({
            message: req.t("file.not_supported"),
          });
        }

        if (data === null) {
          return res
            .status(400)
            .json({ message: req.t("file.image_not_upload") });
        }

        await categoriesModel.findOneAndUpdate(
          {
            _id: id,
          },
          {
            name: name || category.name,
            description: description || category.description,
            media: req.file ? data._id : category.media._id,
          },
          { new: true }
        );
        return res
          .status(200)
          .json({ message: req.t("category.updated_success") });
      }

      await categoriesModel.findOneAndUpdate(
        { _id: id },
        {
          name: name || category.name,
          description: description || category.description,
        }
      );
      return res
        .status(200)
        .json({ message: req.t("category.updated_success") });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const id = req.params.id;
      if (mongoose.Types.ObjectId.isValid(id)) {
        const category = await categoriesModel.findById(id).populate("media");

        if (!category) {
          return res.status(404).json({ message: req.t("not_found.category") });
        }

        const post = await postModel.find({ category: category._id });
        if (post.length > 0) {
          return res.status(400).json({
            message: req.t("category.can_not_remove"),
          });
        }

        const deleteImage = await uploadMediaCloudinary.deleteFile(
          category.media.cloudinary_id
        );
        if (!deleteImage) {
          return res.status(400).json({ message: req.t("server_error") });
        }

        await categoriesModel.findByIdAndDelete(id);

        res.status(200).json({ message: req.t("category.deleted_success") });
      }
      res.status(404).json({ message: req.t("not_found.category") });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const options = optionsPaginate(req, "-like -follow");
      let result = await categoriesModel.paginate({}, options);
      result.docs = await Promise.all(
        result.docs.map(async (category) => {
          return await categoriesModel.populate(category, {
            path: "media",
            select: "url type description",
          });
        })
      );
      return res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  getCategoryDetail: async (req, res) => {
    try {
      const { request_user } = req.body;
      const { categoryId } = req.params;

      let hasLiked = false;
      let hasFollowed = false;
      let isNotification = false;

      const category = await categoriesModel
        .findById(categoryId)
        .populate("media", "url type description");
      if (!category) {
        return res.status(404).json({ message: req.t("not_found.category") });
      }

      if (request_user) {
        const user = await userModel.findById(request_user);
        if (!user) {
          return res.status(404).json({ message: req.t("not_found.user") });
        }
        hasLiked = category.like.some(
          (like) => like.user.toString() === request_user
        );

        const followIndex = category.follow.findIndex(
          (follow) => follow.user.toString() === request_user
        );

        if (followIndex !== -1) {
          hasFollowed = true;
          isNotification = category.follow[followIndex].isNotification;
        }
      }

      return res
        .status(200)
        .json({ category, hasLiked, hasFollowed, isNotification });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  handleLikeCategory: async (req, res) => {
    try {
      const { userId } = req.body;
      const { categoryId } = req.params;

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: req.t("not_found.user") });
      }
      const category = await categoriesModel.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: req.t("not_found.category") });
      }

      const hasLiked = category.like.some(
        (like) => like.user.toString() === userId
      );

      if (hasLiked) {
        await categoriesModel.findByIdAndUpdate(
          category._id,
          {
            $pull: {
              like: { user: userId },
            },
          },
          { new: true }
        );
        return res
          .status(200)
          .json({ message: req.t("category.unlike_success"), isUnliked: true });
      } else {
        await categoriesModel.findByIdAndUpdate(
          category._id,
          {
            $push: {
              like: { user: userId },
            },
          },
          { new: true }
        );
        return res
          .status(200)
          .json({ message: req.t("category.like_success"), isUnliked: false });
      }
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  handleFollowCategory: async (req, res) => {
    try {
      const { userId } = req.body;
      const { categoryId } = req.params;

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: req.t("not_found.user") });
      }
      const category = await categoriesModel.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: req.t("not_found.category") });
      }
      const hasFollowed = category.follow.some(
        (follow) => follow.user.toString() === userId
      );

      if (hasFollowed) {
        await categoriesModel.findByIdAndUpdate(
          category._id,
          {
            $pull: {
              follow: { user: userId },
            },
          },
          { new: true }
        );
        return res.status(200).json({
          message: req.t("category.unfollowed_success"),
          isUnfollowed: true,
        });
      } else {
        await categoriesModel.findByIdAndUpdate(
          category._id,
          {
            $push: {
              follow: { user: userId },
            },
          },
          { new: true }
        );
        return res.status(200).json({
          message: req.t("category.followed_success"),
          isUnfollowed: false,
        });
      }
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  changeIsNotificationAfterFollowCategory: async (req, res) => {
    try {
      const { categoryId, userId } = req.params;
      const { isNotification } = req.body;

      const updateCategory = await categoriesModel.findOneAndUpdate(
        {
          _id: categoryId,
          "follow.user": userId,
        },
        {
          $set: { "follow.$.isNotification": isNotification },
        },
        {
          new: true,
        }
      );
      if (!updateCategory) {
        return res.status(404).json({ message: req.t("not_found.category") });
      }
      return res.status(200).json({
        message: isNotification
          ? req.t("category.enable_notifications_success")
          : req.t("category.disable_notifications_success"),
        isNotification,
      });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  getUserWithNotification: async (categoryId) => {
    try {
      const category = await categoriesModel.findById(categoryId).populate('follow.user');
    
      if (!category) {
        throw new Error('Category not found');
      }
  
      const usersWithNotifications = category.follow.filter(follow => follow.isNotification).map(follow => follow.user);
  
      return usersWithNotifications;
    } catch (error) {
      return null;
    }
  },
};

module.exports = categoriesController;
