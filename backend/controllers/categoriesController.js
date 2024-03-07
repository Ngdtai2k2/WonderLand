const mongoose = require("mongoose");

const mediaController = require("./mediaController");
const Categories = require("../models/Categories");
const createOptions = require("./createOptions");

const categoriesController = {
  createCategory: async (req, res) => {
    try {
      const { name, description, media } = req.body;
      const mediaResponse = await mediaController.createMedia(media, res);

      const newCategory = new Categories({
        name: name,
        description: description,
        media: mediaResponse._id,
      });

      await newCategory.save();
      res.status(201).json({ message: "Created category successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const options = createOptions(req);
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
      return res.status(500).json({ error: error.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { name, description, media } = req.body;
      const id = req.params.id;
      if (mongoose.Types.ObjectId.isValid(id)) {
        const category = await Categories.findById(id);
        if (!category) {
          return res.status(404).json({ message: "Category not found!" });
        }
        const mediaResponse = await mediaController.updateMedia(
          req,
          res,
          category.media
        );

        await Categories.findOneAndUpdate(
          { _id: id },
          {
            name: name,
            description: description,
            media: mediaResponse._id,
          },
          { new: true }
        );
        res.status(200).json({ message: "Updated category successfully!" });
      }
      res.status(404).json({ message: "Category not found!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const id = req.params.id;
      if (mongoose.Types.ObjectId.isValid(id)) {
        const category = await Categories.findById(id);
        if (!category) {
          return res.status(404).json({ message: "Category not found!" });
        }
        await mediaController.deleteMedia(req, res, category.media);
        await Categories.findByIdAndDelete(id);

        res.status(200).json({ message: "Deleted category successfully!" });
      }
      res.status(404).json({ message: "Category not found!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = categoriesController;
