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
          .json({ message: "Name and description are required." });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Category must contain a photo!" });
      }

      const uniqueName = await categoriesModel.findOne({ name: name });

      if (uniqueName) {
        return res
          .status(400)
          .json({ message: "Category name already exists!" });
      }

      let data;
      if (req.file.mimetype.startsWith("image/"))
        data = await uploadMediaCloudinary.uploadImage(req, res, "categories");
      else {
        return res.status(415).json({
          message: "File not supported!",
        });
      }
      if (data === null) {
        return res.status(400).json({ message: "Image not uploaded!" });
      }

      const newCategory = new Categories({
        name: name,
        description: description,
        media: req.file ? data._id : null,
      });

      const newData = await newCategory.save();
      res.status(201).json({
        message: "Created category successfully!",
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
          .json({ message: "Name and description are required." });
      }

      const uniqueName = await categoriesModel.findOne({ name: name });

      if (uniqueName) {
        return res
          .status(400)
          .json({ message: "Category name already exists!" });
      }

      const id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid category id!" });
      }
      const category = await categoriesModel.findById(id).populate("media");
      if (!category) {
        return res.status(404).json({ message: "Category not found!" });
      }

      if (req.file) {
        const deleteImage = await uploadMediaCloudinary.deleteFile(
          category.media.cloudinary_id
        );
        if (!deleteImage) {
          return res
            .status(400)
            .json({ message: "An error occurred, please try again later!" });
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
            message: "File not supported!",
          });
        }

        if (data === null) {
          return res.status(400).json({ message: "Image not uploaded!" });
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
          .json({ message: "Updated category successfully!" });
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
        .json({ message: "Updated category successfully!" });
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
          return res.status(404).json({ message: "Category not found!" });
        }

        const post = await postModel.find({ category: category._id });
        if (post.length > 0) {
          return res.status(400).json({
            message:
              "You can't remove this category because there are linking articles!",
          });
        }

        const deleteImage = await uploadMediaCloudinary.deleteFile(
          category.media.cloudinary_id
        );
        if (!deleteImage) {
          return res
            .status(400)
            .json({ message: "An error occurred, please try again later!" });
        }

        await categoriesModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Deleted category successfully!" });
      }
      res.status(404).json({ message: "Category not found!" });
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

  getCategoryDetails: async (req, res) => {
    try {
      const { name } = req.body;
      const { request_user } = req.query;

      let hasLiked = false;
      let hasFollowed = false;

      const category = await categoriesModel
        .findOne({ name: name })
        .populate("media", "url type description");
      if (!category) {
        return res.status(404).json({ message: "Category not found!" });
      }

      if (request_user) {
        const user = await userModel.findById(request_user);
        if (!user) {
          return res.status(404).json({ message: req.t("not_found.user") });
        }
        hasLiked = category.like.some(
          (like) => like.user.toString() === request_user
        );
        hasFollowed = category.follow.some(
          (follow) => follow.user.toString() === request_user
        );
      }

      return res.status(200).json({ category, hasLiked, hasFollowed });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  handleLikeCategory: async (req, res) => {
    try {
      const { userId } = req.body;
      const { categoryName } = req.params;

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: req.t("not_found.user") });
      }
      const category = await categoriesModel.findOne({ name: categoryName });
      if (!category) {
        return res.status(404).json({ message: "Category not found!" });
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
          .json({ message: "Unliked category successfully!", isUnliked: true });
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
          .json({ message: "Liked category successfully!", isUnliked: false });
      }
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  handleFollowCategory: async (req, res) => {
    try {
      const { userId } = req.body;
      const { categoryName } = req.params;
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: req.t("not_found.user") });
      }
      const category = await categoriesModel.findOne({ name: categoryName });
      if (!category) {
        return res.status(404).json({ message: "Category not found!" });
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
          message: "Unfollowed category successfully!",
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
          message: "Followed category successfully!",
          isUnfollowed: false,
        });
      }
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
};

module.exports = categoriesController;
