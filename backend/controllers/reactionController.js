const mongoose = require("mongoose");

const Post = require("../models/Post");
const Reaction = require("../models/Reaction");
const Comments = require("../models/Comments");

const reactionController = {
  countReactions: async (req, res) => {
    try {
      const { postId, commentId } = req.body;
      const isComment = !!commentId;
      const id = isComment ? commentId : postId;
      const countLike = isComment
        ? await Reaction.countDocuments({ commentId: id, type: 0 })
        : await Reaction.countDocuments({ postId: id, type: 0 });
      const countDislike = isComment
        ? await Reaction.countDocuments({ commentId: id, type: 1 })
        : await Reaction.countDocuments({ postId: id, type: 1 });
      const count = countLike - countDislike;
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  checkReactionByUserId: async (req, res) => {
    try {
      const { postId, commentId, author } = req.body;
      const isComment = !!commentId;
      const id = isComment ? commentId : postId;
      let reactionType = null;

      if (isComment) {
        const reaction = await Reaction.findOne({
          author: author,
          commentId: id,
        });

        if (reaction) {
          reactionType = reaction.type;
        }
      } else {
        const reaction = await Reaction.findOne({
          author: author,
          postId: id,
        });

        if (reaction) {
          reactionType = reaction.type;
        }
      }

      return res.status(200).json({ reactionType });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  deleteReaction: async (req, res) => {
    try {
      const { postId, commentId, author, type } = req.body;

      const isComment = !!commentId;
      const query = isComment
        ? { author: author, commentId: commentId, type: type }
        : { author: author, postId: postId, type: type };
      const result = await Reaction.findOneAndDelete(query);

      if (!result) {
        return res.status(404).json({ message: "Reaction not found!" });
      }

      return res
        .status(200)
        .json({ message: "Reaction deleted successfully!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  createReaction: async (req, res) => {
    try {
      const { author, type, commentId, postId } = req.body;
      const isComment = !!commentId;
      const id = isComment ? commentId : postId;

      const existingReaction = await Reaction.findOne({
        author,
        type,
        [isComment ? "commentId" : "postId"]: id,
      });

      if (existingReaction) {
        return res
          .status(400)
          .json({ message: "You already reacted to this post/comment." });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ message: `Invalid ${isComment ? "comment" : "post"} ID!` });
      }

      const Model = isComment ? Comments : Post;
      const doc = await Model.findById(id);

      if (!doc) {
        return res
          .status(404)
          .json({ message: `${isComment ? "Comment" : "Post"} not found!` });
      }

      const newReaction = new Reaction({
        author,
        type,
        [isComment ? "commentId" : "postId"]: id,
      });

      await newReaction.save();
      return res.status(201).json({ message: "Reaction saved!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // getPostUserReaction: async(req, res) {

  // }
};

module.exports = reactionController;
