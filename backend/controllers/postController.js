const mongoose = require("mongoose");

const Category = require("../models/Categories");
const User = require("../models/User");
const Post = require("../models/Post");
const optionsPaginate = require("../configs/optionsPaginate");
const uploadMediaController = require("./uploadMediaController");

const postController = {
  createPost: async (req, res) => {
    try {
      const { author, content, category, title, type } = req.body;

      if (!mongoose.Types.ObjectId.isValid(category))
        return res.status(400).json({ message: "Invalid category ID!" });

      if (!mongoose.Types.ObjectId.isValid(author))
        return res.status(400).json({ message: "Invalid author ID!" });

      if (!author)
        return res.status(400).json({ message: "Please provide an author!" });

      if (!User.findOne(author))
        return res.status(400).json({ message: "Cannot find author!" });

      const categoryData = await Category.findById(category);
      if (!categoryData)
        return res.status(404).json({ message: "Category not found!" });

      let data;
      if (req.file) {
        if (req.file.mimetype.startsWith("image/"))
          data = await uploadMediaController.uploadImage(req, res);
        else data = await uploadMediaController.uploadVideo(req, res);

        if (data === null)
          return res.status(400).json({
            message: req.file.mimetype.startsWith("image/")
              ? "Upload image failed!"
              : "Upload video failed!",
          });
      }

      const newPost = new Post({
        author: author,
        title: title,
        content: content || null,
        category: categoryData._id,
        media: req.file ? data._id : null,
        type: type,
      });

      const post = await newPost.save();
      const successMessage =
        type == 0 ? "Created post successfully!" : "Created ask successfully!";
      return res.status(201).json({ message: successMessage, post: post });
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
      const options = optionsPaginate(req);
      let result = await Post.paginate({ type: 0 }, options);

      result.docs = await Promise.all(
        result.docs.map(async (post) => {
          return (post = await Post.populate(post, [
            {
              path: "author",
              select: "id fullname",
              populate: {
                path: "media",
                model: "Media",
                select: "url",
              },
            },
            { path: "media", select: "url type" },
            {
              path: "category",
              select: "name",
              populate: {
                path: "media",
                model: "Media",
                select: "url",
              },
            },
          ]));
        })
      );
      res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getAllAskPost: async (req, res) => {
    try {
      const options = optionsPaginate(req);
      let result = await Post.paginate({ type: 1 }, options);

      result.docs = await Promise.all(
        result.docs.map(async (post) => {
          return (post = await Post.populate(post, [
            {
              path: "author",
              select: "id fullname",
              populate: {
                path: "media",
                model: "Media",
                select: "url",
              },
            },
            {
              path: "category",
              select: "name",
              populate: {
                path: "media",
                model: "Media",
                select: "url",
              },
            },
          ]));
        })
      );
      res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  
  getAllPostByUserId: async (req, res) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID!" });
      }
      const user = await User.findById(id);
      if (!user) return res.status(400).json({ message: "User not found!" });

      const options = optionsPaginate(req);
      const { docs, ...paginationData } = await Post.paginate(
        { author: id },
        options
      );
      const populatedDocs = await Promise.all(
        docs.map(async (post) => {
          const populatedPost = await Post.populate(post, [
            {
              path: "author",
              select: "id fullname",
              populate: {
                path: "media",
                model: "Media",
                select: "url",
              },
            },
            { path: "media", select: "url type" },
            {
              path: "category",
              select: "name",
              populate: {
                path: "media",
                model: "Media",
                select: "url",
              },
            },
          ]);
          return populatedPost;
        })
      );

      res
        .status(200)
        .json({ result: { docs: populatedDocs, ...paginationData } });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getAllPostUserReacted: async (req, res) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID!" });
      }
      const user = await User.findById(id);
      if (!user) return res.status(400).json({ message: "User not found!" });
      

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = postController;
