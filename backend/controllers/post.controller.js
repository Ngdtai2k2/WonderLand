const mongoose = require("mongoose");

const Category = require("../models/categories.model");
const User = require("../models/user.model");
const postModel = require("../models/post.model");
const userSocketModel = require("../models/userSocket.model");
const reactionModel = require("../models/reaction.model");
const commentModel = require("../models/comment.model");
const savePostModel = require("../models/savePost.model");
const reportModel = require("../models/report.model");

const optionsPaginate = require("../configs/optionsPaginate");
const uploadMediaCloudinary = require("./uploadMediaCloudinary.controller");

const reactionService = require("../services/reaction.service");
const savePostService = require("../services/savePost.service");
const commentService = require("../services/comment.service");
const algorithmsService = require("../services/algorithms.service");
const notificationService = require("../services/notification.service");
const badWordService = require("../services/badword.service");

const { postPopulateOptions } = require("../constants/constants");
const categoriesController = require("./categories.controller");

const postController = {
  create: async (req, res) => {
    try {
      const { author, content, category, title, type } = req.body;

      if (!author)
        return res.status(400).json({ message: req.t("post.provide_author") });

      if (!User.findOne(author))
        return res.status(400).json({ message: req.t("not_found.author") });

      // bad words
      const filter = await badWordService.initializeFilter();
      
      const filteredTitle = filter.clean(title);
      const filteredContent = filter.clean(content);

      const categoryData = await Category.findById(category).populate("media");
      if (!categoryData)
        return res.status(404).json({ message: req.t("not_found.category") });

      let data;
      if (req.file) {
        if (req.file.mimetype.startsWith("image/"))
          data = await uploadMediaCloudinary.uploadImage(req, res, "posts");
        else
          data = await uploadMediaCloudinary.uploadVideo(
            req,
            res,
            "posts/video"
          );

        if (data === null)
          return res.status(400).json({
            message: req.file.mimetype.startsWith("image/")
              ? req.t("file.image_not_upload")
              : req.t("file.video_not_upload"),
          });
      }

      const newPost = new postModel({
        author: author,
        title: filteredTitle,
        content: filteredContent || null,
        category: categoryData._id,
        media: req.file ? data._id : null,
        type: type,
      });

      const post = await newPost.save();
      const successMessage =
        type == 0
          ? req.t("post.create_post_success")
          : req.t("post.create_ask_success");
      // push notification for user
      const userFollowCategoryEnableNotifications =
        await categoriesController.getUserWithNotification(categoryData._id);

      const messages = {
        en: `The ${categoryData.name} category just got a new article!`,
        vi: `Danh mục ${categoryData.name} vừa có bài viết mới!`,
      };
      userFollowCategoryEnableNotifications.forEach(async (user) => {
        if (!user.isAdmin) {
          const notification = await notificationService.createNotification(
            user._id,
            0,
            "postId",
            post._id,
            messages,
            categoryData.media.url
          );
          const userSocket = await userSocketModel.find({
            user: user._id,
          });
          if (userSocket.length > 0) {
            userSocket.forEach(async (socket) => {
              global._io
                .to(socket.socketId)
                .emit(
                  "category-new-article",
                  `${categoryData.name} category just got a new article!`,
                  notification
                );
            });
          }
        }
      });
      return res.status(201).json({ message: successMessage, post: post });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      let { content, category, title } = req.body;

      title = title.trim();
      if (!title)
        return res.status(400).json({ message: req.t("post.provide_title") });
      // bad words
      const filter = await badWordService.initializeFilter();
      const filteredTitle = filter.clean(title);
      const filteredContent = filter.clean(content);

      const post = await postModel.findById(id).populate("media");
      if (!post)
        return res.status(404).json({ message: req.t("not_found.post") });

      let data;
      if (req.file) {
        // delete old file
        if (post.media?.cloudinary_id) {
          if (post.media?.type === 0) {
            await uploadMediaCloudinary.deleteFile(post.media.cloudinary_id);
          } else {
            await uploadMediaCloudinary.deleteFile(
              post.media.cloudinary_id,
              "video"
            );
          }
        }
        // update new file
        if (req.file.mimetype.startsWith("image/"))
          data = await uploadMediaCloudinary.uploadImage(req, res, "posts");
        else
          data = await uploadMediaCloudinary.uploadVideo(
            req,
            res,
            "posts/video"
          );

        if (data === null)
          return res.status(400).json({
            message: req.file.mimetype.startsWith("image/")
              ? req.t("file.image_not_upload")
              : req.t("file.video_not_upload"),
          });
      }

      const updatedPost = await postModel.findByIdAndUpdate(
        { _id: id },
        {
          title: filteredTitle,
          content: filteredContent || null,
          category: category,
          media: req.file ? data._id : null,
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: req.t("post.updated_success"), updatedPost });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const post = await postModel.findById(id).populate("media");
      if (!post)
        return res.status(404).json({ message: req.t("not_found.post") });

      await reactionModel.deleteMany({ postId: post._id });
      await commentModel.deleteMany({ postId: post._id });
      await savePostModel.deleteMany({ postId: post._id });
      if (post.media?.cloudinary_id) {
        if (post.media.type === 0) {
          await uploadMediaCloudinary.deleteFile(post.media.cloudinary_id);
        } else {
          await uploadMediaCloudinary.deleteFile(
            post.media.cloudinary_id,
            "video"
          );
        }
      }
      await postModel.findByIdAndDelete(id);

      return res.status(200).json({ message: req.t("post.deleted_success") });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  getPostById: async (req, res) => {
    try {
      const id = req.params.id;
      const { user } = req.body;

      const post = await postModel.findById(id);
      if (!post) {
        return res.status(404).json({ message: req.t("not_found.post") });
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
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  getAllPost: async (req, res) => {
    try {
      const { type, request_user } = req.body;
      const { typeQuery } = req.params;

      const options = optionsPaginate(req);
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);

      const query = { type: type };
      if (typeQuery == 2) {
        query.createdAt = { $gte: twentyFourHoursAgo };
      }

      let result = await postModel.paginate(query, options);

      result.docs = await Promise.all(
        result.docs.map(async (post) => {
          let hasReacted = null;
          let hasSavedPost = null;
          if (request_user) {
            const user = await (mongoose.Types.ObjectId.isValid(request_user)
              ? User.findOne({ _id: request_user })
              : User.findOne({ nickname: request_user }));

            if (!user)
              return res.status(404).json({ message: req.t("not_found.user") });
            [hasReacted, hasSavedPost] = await Promise.all([
              reactionService.hasReactionPost(user._id, post._id),
              savePostService.hasSavePost(user._id, post._id),
            ]);
            // disable query
            // const userHasViewedPost = post?.viewers?.includes(request_user);
            // if (userHasViewedPost) return null;
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

          return await postModel.populate(updatedPost, postPopulateOptions);
        })
      );

      result.docs = result.docs.filter((post) => post !== null);
      // Sort the result array based on EdgeRank
      result.docs.sort((a, b) => b.edgeRank - a.edgeRank);

      return res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  getAllPostByUserId: async (req, res) => {
    try {
      const id = req.body.author;

      const user = await (mongoose.Types.ObjectId.isValid(id)
        ? User.findOne({ _id: id })
        : User.findOne({ nickname: id }));

      if (!user)
        return res.status(404).json({ message: req.t("not_found.user") });

      const options = optionsPaginate(req);
      const { docs, ...paginationData } = await postModel.paginate(
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

          return await postModel.populate(updatedPost, postPopulateOptions);
        })
      );

      return res
        .status(200)
        .json({ result: { docs: populatedDocs, ...paginationData } });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  getPostByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { _isFresh } = req.query;

      const categoryData = await Category.findById(categoryId);
      if (!categoryData)
        return res.status(404).json({ message: req.t("not_found.category") });

      const currentDate = new Date();
      const oneDayAgo = new Date(currentDate);
      oneDayAgo.setDate(currentDate.getDate() - 1);

      const options = optionsPaginate(req);
      // query the posts of the day
      const { docs, ...paginationData } = await postModel.paginate(
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
          return await postModel.populate(updatedPost, postPopulateOptions);
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
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  viewPost: async (req, res) => {
    try {
      const { userId, postId } = req.body;

      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ message: req.t("not_found.user") });

      const post = await postModel.findById(postId);
      if (!post)
        return res.status(404).json({ message: req.t("not_found.post") });

      if (!post.viewers.includes(userId)) {
        post.viewers.push(userId);
        await post.save();
      }

      return res.status(200).json({ post });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  deletePostReport: async (req, res) => {
    try {
      const { id, reportId } = req.params;

      const post = await postModel.findById(id);
      if (!post)
        return res.status(404).json({ message: req.t("not_found.post") });

      const report = await reportModel.findById(reportId);
      if (!report)
        return res.status(404).json({ message: req.t("not_found.report") });

      await reactionModel.deleteMany({ postId: post._id });
      await commentModel.deleteMany({ postId: post._id });
      await savePostModel.deleteMany({ postId: post._id });
      if (post.media?.cloudinary_id) {
        if (post.media.type === 0) {
          await uploadMediaCloudinary.deleteFile(post.media.cloudinary_id);
        } else {
          await uploadMediaCloudinary.deleteFile(
            post.media.cloudinary_id,
            "video"
          );
        }
      }
      await postModel.findByIdAndDelete(id);

      const messages = {
        en: "Your post was removed for violating community standards!",
        vi: "Bài viết của bạn đã bị xóa vì vi phạm tiêu chuẩn cộng đồng!",
      };

      const notification = await notificationService.createNotification(
        post.author,
        3,
        id,
        messages,
        ""
      );

      await reportModel.findByIdAndUpdate(
        reportId,
        {
          status: 1,
        },
        {
          new: true,
        }
      );

      const userSocket = await userSocketModel.find({
        user: post.author,
      });

      if (userSocket.length > 0) {
        userSocket.forEach(async (socket) => {
          global._io
            .to(socket.socketId)
            .emit(
              "action-delete-post",
              "Your post was removed for violating community standards!",
              notification
            );
        });
      }

      return res.status(200).json({ message: req.t("post.deleted_success") });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
};

module.exports = postController;
