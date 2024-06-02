const mongoose = require("mongoose");
const unidecode = require("unidecode");

const { postPopulateOptions } = require("../constants/constants");

const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const friendModel = require("../models/friends.model");

const commentService = require("../services/comment.service");
const reactionService = require("../services/reaction.service");
const savePostService = require("../services/savePost.service");
const friendService = require("../services/friend.service");

const searchController = {
  users: async (req, res) => {
    try {
      let { query, _page, _limit, request_user } = req.query;
      let { only_friends } = req.body;
      _page = parseInt(_page) || 1;
      _limit = parseInt(_limit) || 10;
      only_friends = only_friends === true;

      if (!query.trim()) {
        return res.status(200).json({ users: [] });
      }

      let friendsResult = [];
      // query
      let userQueryConditions = {
        $or: [
          {
            fullname: {
              $regex: new RegExp(`(${query}|${unidecode(query)})`, "i"),
            },
          },
          {
            nickname: {
              $regex: new RegExp(`(${query}|${unidecode(query)})`, "i"),
            },
          },
        ],
      };  

      if (request_user) {
        const currentUser = await userModel.findOne({
          $or: [
            {
              _id: mongoose.Types.ObjectId.isValid(request_user)
                ? request_user
                : null,
            },
            { nickname: request_user },
          ],
        });

        if (!currentUser) {
          return res.status(404).json({ message: req.t("not_found.user") });
        }

        const friends = await friendModel
          .find({
            user: currentUser._id,
            status: 1,
          })
          .populate("friend");

        const friendIds = friends.map((friend) => friend.friend._id);

        if (only_friends) {
          userQueryConditions._id = { $in: friendIds };
        } else {
          friendsResult = await userModel
            .find({
              _id: { $in: friendIds },
              ...userQueryConditions,
            })
            .select("about fullname nickname media")
            .populate("media");

          friendsResult = await Promise.all(
            friendsResult.map(async (user) => {
              const friendCount = await friendService.count(user._id);
              return {
                ...user.toObject(),
                isFriend: true,
                totalFriend: friendCount,
              };
            })
          );

          userQueryConditions._id = { $nin: friendIds };
        }
      }

      const userQuery = userModel
        .find(userQueryConditions)
        .select("about fullname nickname media")
        .populate("media");

      const usersResult = await userQuery
        .skip((_page - 1) * _limit)
        .limit(_limit);
      const combinedResults = only_friends
        ? usersResult
        : [...friendsResult, ...usersResult];
      const totalResults = combinedResults.length;
      const totalPages = Math.ceil(totalResults / _limit);
      const currentPage = _page;
      const hasNextPage = _page < totalPages;
      const hasPrevPage = _page > 1;

      return res.status(200).json({
        users: {
          data: combinedResults.slice((_page - 1) * _limit, _page * _limit),
          totalPages: totalPages,
          currentPage: currentPage,
          hasNextPage: hasNextPage,
          hasPrevPage: hasPrevPage,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
  posts: async (req, res) => {
    try {
      let { query, _page, _limit, request_user } = req.query;
      _page = parseInt(_page) || 1;
      _limit = parseInt(_limit) || 10;

      if (!query.trim()) {
        return res.status(200).json({ posts: [] });
      }

      const postQuery = postModel
        .find({
          $or: [
            { title: { $regex: new RegExp(`(${query}|${unidecode(query)})`, "i") } },
            { content: { $regex: new RegExp(`(${query}|${unidecode(query)})`, "i") } },
          ],
        })
        .populate(postPopulateOptions);

      const posts = await postQuery.skip((_page - 1) * _limit).limit(_limit);
      const postCount = await postModel.countDocuments({
        $or: [
          { title: { $regex: new RegExp(query, "i") } },
          { content: { $regex: new RegExp(query, "i") } },
        ],
      });
      const totalPages = Math.ceil(postCount / _limit);
      const currentPage = _page;
      const hasNextPage = _page < totalPages;
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
        posts: {
          data: populatedPosts,
          totalPages: totalPages,
          currentPage: currentPage,
          hasNextPage: hasNextPage,
          hasPrevPage: hasPrevPage,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
};

module.exports = searchController;
