const mongoose = require("mongoose");

const Category = require("../models/Categories");
const User = require("../models/User");
const Post = require("../models/Post");
const optionsPaginate = require("../configs/optionsPaginate");
const uploadMediaController = require("./uploadMediaController");
const postPopulateOptions = require("../configs/constants");
const reactionService = require("../services/reactionService");
const savePostService = require("../services/savePostService");

const postController = {
  create: async (req, res) => {
    try {
      const { author, content, category, title, type } = req.body;

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
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  getPostById: async (req, res) => {
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
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  getAllPost: async (req, res) => {
    try {
      const { type, author } = req.body;
      const { typeQuery } = req.params;

      const options = optionsPaginate(req);
      let query = { type: type };

      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);

      if (typeQuery == 2) {
        query.createdAt = { $gte: twentyFourHoursAgo };
      }

      let result = await Post.paginate(query, options);

      result.docs = await Promise.all(
        result.docs.map(async (post) => {
          let hasReacted = null;
          let hasSavedPost = null;
          if (author) {
            const user = await User.findById(author);
            if (!user)
              return res.status(400).json({ message: "User not found!" });
            hasReacted = await reactionService.hasReactionPost(
              author,
              post._id
            );
            hasSavedPost = await savePostService.hasSavePost(
              author,
              post._id
            );
          }
          const totalReaction = await reactionService.countReactions(
            post._id,
            null
          );
          const updatedPost = {
            ...post.toObject(),
            hasReacted,
            hasSavedPost,
            totalReaction,
          };
          return (post = await Post.populate(updatedPost, postPopulateOptions));
        })
      );
      res.status(200).json({ result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  getAllPostByUserId: async (req, res) => {
    try {
      const id = req.body.userId;

      const user = await User.findById(id);
      if (!user) return res.status(400).json({ message: "User not found!" });

      const options = optionsPaginate(req);
      const { docs, ...paginationData } = await Post.paginate(
        { author: id },
        options
      );
      const populatedDocs = await Promise.all(
        docs.map(async (post) => {
          let hasReacted = null;
          let hasSavedPost = null;
          hasReacted = await reactionService.hasReactionPost(id, post._id);
          hasSavedPost = await savePostService.hasSavePost(id, post._id);
          const totalReaction = await reactionService.countReactions(
            post._id,
            null
          );
          const updatedPost = {
            ...post.toObject(),
            hasReacted,
            hasSavedPost,
            totalReaction,
          };
          const populatedPost = await Post.populate(
            updatedPost,
            postPopulateOptions
          );
          return populatedPost;
        })
      );

      res
        .status(200)
        .json({ result: { docs: populatedDocs, ...paginationData } });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
};

module.exports = postController;
