const mongoose = require("mongoose");

const Post = require("../models/post.model");
const Categories = require("../models/categories.model");
const uploadMediaCloudinary = require("./uploadMediaCloudinary.controller");
const optionsPaginate = require("../configs/optionsPaginate");

const categoriesController = {
  create: async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Category must contain a photo!" });
      }

      const uniqueName = await Categories.findOne({ name: name });

      if (uniqueName) {
        return res
          .status(400)
          .json({ message: "Category name already exists!" });
      }

      let data;
      if (req.file.mimetype.startsWith("image/"))
        data = await uploadMediaCloudinary.uploadImage(req, res);
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
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { name, description } = req.body;
      const id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid category id!" });
      }
      const category = await Categories.findById(id).populate("media");
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
          data = await uploadMediaCloudinary.uploadImage(req, res);
        else {
          return res.status(415).json({
            message: "File not supported!",
          });
        }

        if (data === null) {
          return res.status(400).json({ message: "Image not uploaded!" });
        }

        await Categories.findOneAndUpdate(
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

      await Categories.findOneAndUpdate(
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
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const id = req.params.id;
      if (mongoose.Types.ObjectId.isValid(id)) {
        const category = await Categories.findById(id).populate("media");

        if (!category) {
          return res.status(404).json({ message: "Category not found!" });
        }

        const post = await Post.find({ category: category._id });
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

        await Categories.findByIdAndDelete(id);

        res.status(200).json({ message: "Deleted category successfully!" });
      }
      res.status(404).json({ message: "Category not found!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const options = optionsPaginate(req);
      let result = await Categories.paginate({}, options);
      result.docs = await Promise.all(
        result.docs.map(async (category) => {
          return await Categories.populate(category, {
            path: "media",
            select: "url type description",
          });
        })
      );
      return res.status(200).json({ result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  getCategoryDetails: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Categories.findOne({ name: name }).populate(
        "media",
        "url type description"
      );
      if (!category) {
        return res.status(404).json({ message: "Category not found!" });
      }
      return res.status(200).json({ category });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
};

module.exports = categoriesController;
