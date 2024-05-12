const mongoose = require("mongoose");

const { postPopulateOptions } = require("../constants/constants");
const optionsPaginate = require("../configs/optionsPaginate");

const commentsModel = require("../models/comment.model");
const postModel = require("../models/post.model");
const reactionModel = require("../models/reaction.model");
const userModel = require("../models/user.model");

const commentService = require("../services/comment.service");
const reactionService = require("../services/reaction.service");
const savePostService = require("../services/savePost.service");

const reactionController = {
  handleLikePost: async (req, res) => {
    reactionService.handleReaction(req, res, "postId");
  },

  hasReactionPost: async (userId, postId) => {
    const reaction = await reactionModel.findOne({
      author: userId,
      postId: postId,
    });
    if (!reaction) {
      return null;
    }
    return reaction.type;
  },

  countReactions: async (postId, commentId) => {
    try {
      const query = commentId ? { commentId } : { postId };
      const reactions = await reactionModel.countDocuments({
        ...query,
        type: { $in: [0, 1] },
      });
      return reactions;
    } catch (error) {
      return null;
    }
  },

  getPostUserReacted: async (req, res) => {
    try {
      const { author } = req.body;
      if (!author) {
        return res.status(404).json({ message: "Please provide your userId!" });
      }
      const user = await (mongoose.Types.ObjectId.isValid(author)
        ? userModel.findOne({ _id: author })
        : userModel.findOne({ nickname: author }));

      if (!user) return res.status(404).json({ message: "User not found!" });

      const reactionPosts = await reactionModel.find({ author: user._id }).populate(
        "postId"
      );

      const filteredPosts = reactionPosts.filter(
        (reactionPost) => reactionPost.postId
      );

      const postIdList = filteredPosts.map((post) => post.postId);

      const options = optionsPaginate(req);
      const result = await postModel.paginate({ _id: { $in: postIdList } }, options);

      result.docs = await Promise.all(
        result.docs.map(async (reactionPost) => {
          const postId = reactionPost._id;
          let hasReacted = null;
          let hasSavedPost = null;

          [hasReacted, hasSavedPost] = await Promise.all([
            reactionService.hasReactionPost(user._id, postId),
            savePostService.hasSavePost(user._id, postId),
          ]);

          const [totalReaction, totalComment] = await Promise.all([
            reactionService.countReactions(postId, null, null),
            commentService.count(postId),
          ]);

          const updatedSavedPost = {
            ...reactionPost.toObject(),
            hasReacted,
            hasSavedPost,
            totalReaction,
            totalComment,
          };

          return await postModel.populate(updatedSavedPost, postPopulateOptions);
        })
      );

      return res.status(200).json({ result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  handleLikeComment: async (req, res) => {
    reactionService.handleReaction(req, res, "commentId");
  },

  handleLikeReply: async (req, res) => {
    try {
      const { id, author, type } = req.body;

      const reply = await commentsModel.findOne({ "replies._id": id });
      if (!reply) {
        return res.status(404).json({ message: "Reply not found!" });
      }
      const reaction = await reactionModel.findOne({
        author,
        replyId: id,
      });
      if (reaction) {
        if (reaction.type == type) {
          await reactionModel.findOneAndDelete(reaction._id);
          return res.status(200).json({ removed: true });
        } else {
          await reactionModel.findOneAndUpdate(
            { _id: reaction._id },
            {
              type: type,
            },
            {
              new: true,
            }
          );
          return res.status(200).json({ message: "Reaction updated!" });
        }
      } else {
        await reactionModel.create({
          author: author,
          type: type,
          replyId: id,
        });
        return res.status(201).json({ message: "Reaction saved!" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
};

module.exports = reactionController;
