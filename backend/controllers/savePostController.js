const mongoose = require("mongoose");
const { postPopulateOptions } = require("../constants/constants");
const optionsPaginate = require("../configs/optionsPaginate");
const Post = require("../models/Post");
const SavePost = require("../models/SavePost");
const User = require("../models/User");
const commentService = require("../services/comment.service");
const reactionService = require("../services/reaction.service");
const savePostService = require("../services/savePost.service");

const savePostController = {
  handleSavePost: async (req, res) => {
    try {
      const { user, id } = req.body;
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found!" });
      const savePost = await SavePost.findOne({
        user,
        postId: id,
      });

      if (!savePost) {
        await SavePost.create({
          user: user,
          postId: id,
        });
        return res.status(201).json({ message: "Post saved!", state: true });
      }
      await SavePost.findOneAndDelete(savePost._id);
      return res.status(200).json({ message: "Post unsaved!", state: false });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  hasSavePost: async (userId, postId) => {
    const savePost = await SavePost.findOne({
      user: userId,
      postId: postId,
    });
    if (!savePost) {
      return false;
    }
    return true;
  },

  getSavePostByUser: async (req, res) => {
    try {
      const { author } = req.body;
      if (!author) {
        return res
          .status(404)
          .json({ message: "Please provide your user ID!" });
      }
      const user = await (mongoose.Types.ObjectId.isValid(author)
        ? User.findOne({ _id: author })
        : User.findOne({ nickname: author }));

      if (!user) return res.status(404).json({ message: "User not found!" });

      const options = optionsPaginate(req);

      const result = await SavePost.paginate({ user: user._id }, options);
      await SavePost.populate(result.docs, { path: "postId" });

      result.docs = await Promise.all(
        result.docs.map(async (savedPost) => {
          const postId = savedPost.postId;
          let hasReacted = null;
          let hasSavedPost = null;
          
          [hasReacted, hasSavedPost] = await Promise.all([
            reactionService.hasReactionPost(user._id, postId),
            savePostService.hasSavePost(user._id, postId),
          ]);

          const [totalReaction, totalComment] = await Promise.all([
            reactionService.countReactions(postId, null),
            commentService.count(postId),
          ]);

          const updatedSavedPost = {
            ...postId.toObject(),
            hasReacted,
            hasSavedPost,
            totalReaction,
            totalComment,
          };

          return (savedPost = await Post.populate(
            updatedSavedPost,
            postPopulateOptions
          ));
        })
      );
      return res.status(200).json({ result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
};

module.exports = savePostController;
