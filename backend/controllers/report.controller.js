const optionsPaginate = require("../configs/optionsPaginate");
const { reportPopulateOptions } = require("../constants/constants");

const commentModel = require("../models/comment.model");
const postModel = require("../models/post.model");
const reportModel = require("../models/report.model");
const userModel = require("../models/user.model");

const notificationService = require("../services/notification.service");
const socketService = require("../services/socket.service");
const userService = require("../services/user.service");

const reportController = {
  create: async (req, res) => {
    try {
      const { id, userId, reason, rule } = req.body;
      const { _report, _comment_id } = req.query;

      const user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found!" });

      let targetField;
      const getModel = async (_report) => {
        switch (_report) {
          case "post":
            targetField = "postId";
            return postModel.findById(id);
          case "comment":
            targetField = "commentId";
            return commentModel.findById(id);
          case "reply":
            targetField = "replyId";
            return commentModel
              .findById(_comment_id)
              .then((comment) =>
                comment.replies.find((reply) => reply._id.equals(id))
              );
          default:
            return Promise.reject("Invalid report type!");
        }
      };

      const item = await getModel(_report);

      if (!item)
        return res.status(404).json({ message: `${_report} not found!` });

      if (item.author.toString() === userId)
        return res
          .status(400)
          .json({ message: `You cannot report your own ${_report}!` });

      const report = reportModel.find({
        [_report]: id,
        user: userId,
      });
      if (report.length > 0)
        return res
          .status(400)
          .json({ message: `You have already reported this ${_report}!` });

      const newReport = new reportModel({
        user: userId,
        [`${_report}`]: id,
        reason,
        status: 0,
        rule: rule,
      });

      if (_report === "reply") {
        newReport.comment = _comment_id;
      }

      await newReport.save();

      const admins = await userService.getAdmins(req, res);

      admins.forEach(async (admin) => {
        const notification = await notificationService.createNotification(
          admin._id,
          3,
          targetField,
          id,
          `${user.nickname} has just sent a ${_report} report for you to review!`,
          "https://img.upanh.tv/2024/05/09/report.jpg"
        );
        const sockets = await socketService.getSocket(admin._id);
        sockets.forEach(async (socket) => {
          global._io
            .to(socket.socketId)
            .emit(
              "report-for-admin",
              `${user.nickname} has just sent a ${_report} report for you to review!`,
              notification
            );
        });
      });

      return res
        .status(200)
        .json({ message: "The report has been submitted!", newReport });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred, please try again later!" });
    }
  },

  getAll: async (req, res) => {
    try {
      const options = optionsPaginate(req);
      const { _status } = req.query;

      let result = await reportModel.paginate({ status: _status }, options);

      result.docs = await Promise.all(
        result.docs.map(async (report) => {
          let reply;
          const comment = await commentModel.findById(report?.comment);
          if (comment && report.reply) {
            reply = comment.replies.find((reply) =>
              reply._id.equals(report.reply)
            );
            if (reply) {
              const author = await userModel
                .findById(reply.author)
                .select("_id nickname")
                .populate({
                  path: "media",
                  select: "_id url",
                });
              reply = { ...reply.toObject(), author };
            }
          }
          const updatedReport = {
            ...report.toObject(),
            reply,
          };
          return await reportModel.populate(
            updatedReport,
            reportPopulateOptions
          );
        })
      );

      return res.status(200).json({ result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred, please try again later!" });
    }
  },

  rejectedReport: async (req, res) => {
    try {
      const { id } = req.params;

      const report = await reportModel.findById(id).populate("user");
      if (!report)
        return res.status(404).json({ message: "Report not found!" });
      if (report.status == 2)
        return res
          .status(400)
          .json({ message: "This report has already been rejected!" });
      // rejected
      report.status = 2;
      await report.save();

      let target;
      let targetField;
      if (report.post) {
        target = await postModel.findById(report.post).populate("author");
        targetField = "post";
      } else if (report.comment && report.reply) {
        target = await commentModel
          .findById(report.comment)
          .then((comment) =>
            comment.replies.find((reply) => reply._id.equals(report.reply))
          );
        const author = await userModel
          .findById(target.author)
          .select("_id nickname")
          .populate({
            path: "media",
            select: "_id url",
          });
        target = { ...target.toObject(), author };
        targetField = "reply";
      } else {
        target = await commentModel.findById(report.comment).populate("author");
        targetField = "comment";
      }
      // push notification
      const sockets = await socketService.getSocket(report.user);
      sockets.forEach(async (socket) => {
        // create notification
        let notification;
        if (!report.user.isAdmin) {
          notification = await notificationService.createNotification(
            report.user,
            3,
            `${targetField}Id`,
            target?._id,
            `Report ${target.author.nickname}'s ${targetField} of your rejected account!`,
            "https://img.upanh.tv/2024/05/11/OIG2.oag.jpg"
          );
        }
        // push notification
        global._io
          .to(socket.socketId)
          .emit(
            "report-refused",
            `Report ${target.author.nickname}'s ${targetField} of your rejected account!`,
            notification
          );
      });

      return res.status(200).json({ message: "Report refused!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred, please try again later!" });
    }
  },
};

module.exports = reportController;
