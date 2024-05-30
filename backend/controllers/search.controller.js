const mongoose = require("mongoose");

const { postPopulateOptions } = require("../constants/constants");

const postModel = require("../models/post.model");
const userModel = require("../models/user.model");

const commentService = require("../services/comment.service");
const reactionService = require("../services/reaction.service");
const savePostService = require("../services/savePost.service");

const searchController = {
  search: async (req, res) => {
    try {
      let { query, _page, _limit, request_user } = req.query;
      _page = parseInt(_page) || 1;
      _limit = parseInt(_limit) || 10;

      if (!query.trim()) {
        return res.status(200).json({ users: [], posts: [] });
      }

      const userQuery = userModel
        .find({
          $or: [
            { fullname: { $regex: new RegExp(query, "i") } },
            { nickname: { $regex: new RegExp(query, "i") } },
          ],
        })
        .select("-isAdmin")
        .populate("media");

      const postQuery = postModel
        .find({
          $or: [
            { title: { $regex: new RegExp(query, "i") } },
            { content: { $regex: new RegExp(query, "i") } },
          ],
        })
        .populate(postPopulateOptions);

      const [users, posts] = await Promise.all([
        userQuery.skip((_page - 1) * _limit).limit(_limit),
        postQuery.skip((_page - 1) * _limit).limit(_limit),
      ]);

      const userCount = await userModel.countDocuments();
      const postCount = await postModel.countDocuments();
      const totalPagesUsers = Math.ceil(userCount / _limit);
      const totalPagesPosts = Math.ceil(postCount / _limit);

      const currentPage = _page;
      const hasNextPageUsers = _page < totalPagesUsers;
      const hasNextPagePosts = _page < totalPagesPosts;
      const hasPrevPage = _page > 1;

      const populatedPosts = await Promise.all(
        posts.map(async (post) => {
          const [totalReaction, totalComment] = await Promise.all([
            reactionService.countReactions(post._id, null),
            commentService.count(post._id),
          ]);
          let hasReacted = null;
          let hasSavedPost = null;
          if (request_user) {
            const user = await (mongoose.Types.ObjectId.isValid(request_user)
              ? userModel.findOne({ _id: request_user })
              : userModel.findOne({ nickname: request_user }));

            if (!user)
              return res.status(404).json({ message: req.t("not_found.user") });
            [hasReacted, hasSavedPost] = await Promise.all([
              reactionService.hasReactionPost(user._id, post._id),
              savePostService.hasSavePost(user._id, post._id),
            ]);
          }

          return {
            ...post.toObject(),
            hasReacted,
            hasSavedPost,
            totalReaction,
            totalComment,
          };
        })
      );

      return res.status(200).json({
        users: {
          data: users,
          totalPages: totalPagesUsers,
          currentPage: currentPage,
          hasNextPage: hasNextPageUsers,
          hasPrevPage: hasPrevPage,
        },
        posts: {
          data: populatedPosts,
          totalPages: totalPagesPosts,
          currentPage: currentPage,
          hasNextPage: hasNextPagePosts,
          hasPrevPage: hasPrevPage,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
};

module.exports = searchController;
