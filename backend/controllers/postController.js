const mongoose = require("mongoose");

const Category = require("../models/Categories");
const mediaController = require("../controllers/mediaController");
const Post = require("../models/Post");
const createOptions = require("./createOptions");
const uploadMediaController = require("./uploadMediaController");

const postController = {
  createPost: async (req, res) => {
    try {
      const { author, content, category } = req.body;

      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "Invalid category ID!" });
      }

      if (!mongoose.Types.ObjectId.isValid(author)) {
        return res.status(400).json({ message: "Invalid author ID!" });
      }

      if (!author) {
        return res.status(400).json({ message: "Please provide an author!" });
      }

      const categoryData = await Category.findById(category);
      if (!categoryData) {
        return res.status(404).json({ message: "Category not found!" });
      }

      let data;
      if (req.file && req.file.mimetype.startsWith("image/")) {
        data = await uploadMediaController.uploadImage(req, res);
        if (data === null) {
          return res.status(400).json({ message: "Upload image failed!" });
        }
      } else {
        data = await uploadMediaController.uploadVideo(req, res);
        if (data === null) {
          return res.status(400).json({ message: "Upload video failed!" });
        }
      }

      const newPost = new Post({
        author: author,
        content: content || null,
        category: categoryData._id,
        media: data ? data._id : null,
        type: req.file && req.file.mimetype.startsWith("image/") ? 0 : 1,
      });

      const post = await newPost.save();
      return res
        .status(201)
        .json({ message: "Created post successfully!", post: post });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getPostWithMediaById: async (req, res) => {
    try {
      const id = req.params.id;
      if (mongoose.Types.ObjectId.isValid(id)) {
        const post = await Post.findById(id);
        if (!post) {
          return res.status(404).json({ message: "Post not found!" });
        }
        const postWithMedia = await Post.findById(post._id).populate("media");
        return res.status(200).json({ post: postWithMedia });
      }
      return res.status(404).json({ message: "Post not found!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getAllPost: async (req, res) => {
    try {
      const options = createOptions(req);
      let result = await Post.paginate({}, options);

      result.docs = await Promise.all(
        result.docs.map(async (post) => {
          post = await Post.populate(post, {
            path: "media",
            select: "url type description",
          });
          return await Post.populate(post, {
            path: "author",
            select: "fullname avatar",
          });
        })
      );

      res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = postController;
