const mongoose = require("mongoose");
const { postPopulateOptions } = require("../constants/constants");
const optionsPaginate = require("../configs/optionsPaginate");

const postModel = require("../models/post.model");
const savePostModel = require("../models/savePost.model");
const userModel = require("../models/user.model");

const commentService = require("../services/comment.service");
const reactionService = require("../services/reaction.service");
const savePostService = require("../services/savePost.service");

const savePostController = {
  handleSavePost: async (req, res) => {
    try {
      const { user, id } = req.body;
      const post = await postModel.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found!" });
      const savePost = await savePostModel.findOne({
        user,
        postId: id,
      });

      if (!savePost) {
        await savePostModel.create({
          user: user,
          postId: id,
        });
        return res.status(201).json({ message: "Post saved!", state: true });
      }
      await savePostModel.findOneAndDelete(savePost._id);
      return res.status(200).json({ message: "Post unsaved!", state: false });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  hasSavePost: async (userId, postId) => {
    const savePost = await savePostModel.findOne({
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
        ? userModel.findOne({ _id: author })
        : userModel.findOne({ nickname: author }));

      if (!user) return res.status(404).json({ message: "User not found!" });

      const options = optionsPaginate(req);

      const result = await savePostModel.paginate({ user: user._id }, options);
      await savePostModel.populate(result.docs, { path: "postId" });

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

          return (savedPost = await postModel.populate(
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
