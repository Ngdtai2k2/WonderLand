const mongoose = require("mongoose");

const Category = require("../models/categories.model");
const User = require("../models/user.model");
const Post = require("../models/post.model");

const optionsPaginate = require("../configs/optionsPaginate");
const uploadMediaCloudinary = require("./uploadMediaCloudinary.controller");

const reactionService = require("../services/reaction.service");
const savePostService = require("../services/savePost.service");
const commentService = require("../services/comment.service");
const algorithmsService = require("../services/algorithms.service");

const { postPopulateOptions } = require("../constants/constants");

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
          data = await uploadMediaCloudinary.uploadImage(req, res);
        else data = await uploadMediaCloudinary.uploadVideo(req, res);

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
      const { user } = req.body;

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found!" });
      }

      let hasReacted = null;
      let hasSavedPost = null;
      if (user) {
        [hasReacted, hasSavedPost] = await Promise.all([
          reactionService.hasReactionPost(user, id),
          savePostService.hasSavePost(user, id),
        ]);
      }

      const [totalReaction, totalComment] = await Promise.all([
        reactionService.countReactions(id, null),
        commentService.count(id),
      ]);

      const postData = await post.populate(postPopulateOptions);
      const result = {
        ...postData.toObject(),
        hasReacted,
        hasSavedPost,
        totalReaction,
        totalComment,
      };
      return res.status(200).json({ result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred, please try again later!" });
    }
  },

  getAllPost: async (req, res) => {
    try {
      const { type, author } = req.body;
      const { typeQuery } = req.params;

      const options = optionsPaginate(req);
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);

      const query = { type: type };
      if (typeQuery == 2) {
        query.createdAt = { $gte: twentyFourHoursAgo };
      }

      let result = await Post.paginate(query, options);

      result.docs = await Promise.all(
        result.docs.map(async (post) => {
          let hasReacted = null;
          let hasSavedPost = null;
          if (author) {
            const user = await (mongoose.Types.ObjectId.isValid(author)
              ? User.findOne({ _id: author })
              : User.findOne({ nickname: author }));

            if (!user)
              return res.status(404).json({ message: "User not found!" });
            [hasReacted, hasSavedPost] = await Promise.all([
              reactionService.hasReactionPost(user._id, post._id),
              savePostService.hasSavePost(user._id, post._id),
            ]);
          }

          const [totalReaction, totalComment] = await Promise.all([
            reactionService.countReactions(post._id, null),
            commentService.count(post._id),
          ]);

          const edgeRank = await algorithmsService.calculateEdgeRank({
            likes: totalReaction,
            comments: totalComment,
            shares: 0, // Assuming shares are not considered in your EdgeRank calculation
            createdAt: post.createdAt,
          });

          const updatedPost = {
            ...post.toObject(),
            hasReacted,
            hasSavedPost,
            totalReaction,
            totalComment,
            edgeRank,
          };

          return await Post.populate(updatedPost, postPopulateOptions);
        })
      );

      // Sort the result array based on EdgeRank
      result.docs.sort((a, b) => b.edgeRank - a.edgeRank);

      res.status(200).json({ result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  getAllPostByUserId: async (req, res) => {
    try {
      const id = req.body.author;

      const user = await (mongoose.Types.ObjectId.isValid(id)
        ? User.findOne({ _id: id })
        : User.findOne({ nickname: id }));

      if (!user) return res.status(404).json({ message: "User not found!" });

      const options = optionsPaginate(req);
      const { docs, ...paginationData } = await Post.paginate(
        { author: user._id },
        options
      );

      const populatedDocs = await Promise.all(
        docs.map(async (post) => {
          let hasReacted = await reactionService.hasReactionPost(
            user._id,
            post._id
          );
          let hasSavedPost = await savePostService.hasSavePost(
            user._id,
            post._id
          );

          const [totalReaction, totalComment] = await Promise.all([
            reactionService.countReactions(post._id, null),
            commentService.count(post._id),
          ]);

          const updatedPost = {
            ...post.toObject(),
            hasReacted,
            hasSavedPost,
            totalReaction,
            totalComment,
          };

          return await Post.populate(updatedPost, postPopulateOptions);
        })
      );

      return res
        .status(200)
        .json({ result: { docs: populatedDocs, ...paginationData } });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  getPostByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const { _isFresh } = req.query;

      const categoryData = await Category.findOne({ name: category });
      if (!categoryData)
        return res.status(404).json({ message: "Category not found!" });

      const currentDate = new Date();
      const oneDayAgo = new Date(currentDate);
      oneDayAgo.setDate(currentDate.getDate() - 1);

      const options = optionsPaginate(req);
      // query the posts of the day
      const { docs, ...paginationData } = await Post.paginate(
        { category: categoryData._id, createdAt: { $gte: oneDayAgo } },
        { options }
      );

      const populatedDocs = await Promise.all(
        docs.map(async (post) => {
          let hasReacted = await reactionService.hasReactionPost(
            post.author,
            post._id
          );
          let hasSavedPost = await savePostService.hasSavePost(
            post.author,
            post._id
          );
          const [totalReaction, totalComment] = await Promise.all([
            reactionService.countReactions(post._id, null),
            commentService.count(post._id),
          ]);
          const updatedPost = {
            ...post.toObject(),
            hasReacted,
            hasSavedPost,
            totalReaction,
            totalComment,
          };
          return await Post.populate(updatedPost, postPopulateOptions);
        })
      );

      if (_isFresh === "false") {
        // sort by total reaction
        populatedDocs.sort((a, b) => b.totalReaction - a.totalReaction);
      }

      return res
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
