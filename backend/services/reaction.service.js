const Reaction = require("../models/reaction.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const userSocketModel = require("../models/userSocket.model");
const notificationModel = require("../models/notification.model");
const userModel = require("../models/user.model");
const notificationService = require("./notification.service");

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

      const user = await userModel.findById(targetModel.author);

      const typeNotification =
        targetField === "postId" ? 0 : targetField === "commentId" ? 1 : 2;
      const actionField = targetField.slice(0, targetField.indexOf("Id"));
      const action = newType ? "liked" : "disliked";
      const msg = `${user.nickname} just ${action} your ${actionField}!`;

      const userSocket = await userSocketModel.find({
        user: targetModel.author,
      });

      const reaction = await Reaction.findOne({ author, [targetField]: id });

      // if previously interacted
      if (reaction) {
        if (reaction.type === newType) {
          // remove
          await Reaction.findByIdAndDelete(reaction._id);
          if (await notificationModel.exists({ [targetField]: id })) {
            await notificationModel.deleteMany({ [targetField]: id });
          }
          return res.status(200).json({ removed: true });
        } else {
          // update
          await Reaction.findByIdAndUpdate(
            reaction._id,
            { type },
            { new: true }
          );
          // push notification
          if (author !== targetModel.author.toString()) {
            const notification = await notificationService.createNotification(
              targetModel.author,
              typeNotification,
              targetField,
              id,
              msg,
              `${id}`
            );
            if (userSocket.length > 0) {
              userSocket.forEach((socket) => {
                global._io
                  .to(socket.socketId)
                  .emit("msg-action-reaction", msg, notification);
              });
            }
          }

          return res.status(200).json({ message: "Reaction updated!" });
        }
      } else {
        // if you haven't interacted before
        await Reaction.create({ author, type, [targetField]: id });

        // push notification
        if (author !== targetModel.author.toString()) {
          const notification = await notificationService.createNotification(
            targetModel.author,
            typeNotification,
            targetField,
            id,
            msg,
            `${id}`
          );
          if (userSocket.length > 0) {
            userSocket.forEach((socket) => {
              global._io
                .to(socket.socketId)
                .emit("msg-action-reaction", msg, notification);
            });
          }
        }
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
