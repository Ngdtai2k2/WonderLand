const Reaction = require("../models/reaction.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

const reactionService = {
  hasReactionPost: async (userId, postId) => {
    const reaction = await Reaction.findOne({
      author: userId,
      postId: postId,
    });
    if (!reaction) {
      return null;
    }
    return reaction.type;
  },

  countReactions: async (postId, commentId, replyId) => {
    try {
      let query = { postId };
      if (commentId) {
        query = { ...query, commentId };
        if (replyId) {
          query = { ...query, replyId };
        }
      }

      const reactions = await Reaction.countDocuments({
        ...query,
        type: { $in: [0, 1] },
      });

      return reactions;
    } catch (error) {
      return null;
    }
  },

  handleReaction: async (req, res, targetField) => {
    try {
      const { id, author, type } = req.body;

      const newType = type === 1 ? true : false;

      const targetModel = await (targetField === "postId"
        ? Post
        : targetField === "commentId"
        ? Comment
        : null
      ).findById(id);

      if (!targetModel) {
        return res.status(404).json({
          message: `${
            targetField.charAt(0).toUpperCase() + targetField.slice(1)
          } not found!`,
        });
      }

      const reaction = await Reaction.findOne({ author, [targetField]: id });
      if (reaction) {
        if (reaction.type === newType) {
          await Reaction.findByIdAndDelete(reaction._id);
          return res.status(200).json({ removed: true });
        } else {
          await Reaction.findByIdAndUpdate(
            reaction._id,
            { type },
            { new: true }
          );
          return res.status(200).json({ message: "Reaction updated!" });
        }
      } else {
        await Reaction.create({ author, type, [targetField]: id });
        return res.status(201).json({ message: "Reaction saved!" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred, please try again later!" });
    }
  },

  hasReactionComment: async (targetField, userId, id) => {
    const reaction = await Reaction.findOne({
      author: userId,
      [targetField]: id,
    });
    if (!reaction) {
      return null;
    }
    return reaction.type;
  },

  countReactionComment: async (targetField, id, type) => {
    try {
      const reactions = await Reaction.countDocuments({
        [targetField]: id,
        type: { $in: type ? 1 : 0 },
      });
      return reactions;
    } catch (error) {
      return null;
    }
  },
};

module.exports = reactionService;
