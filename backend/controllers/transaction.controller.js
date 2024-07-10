const transactionModel = require("../models/transaction.model");
const userModel = require("../models/user.model");

const socketService = require("../services/socket.service");
const notificationService = require("../services/notification.service");
const userService = require("../services/user.service");

const optionsPaginate = require("../configs/optionsPaginate");
const messagesTransaction = require("../constants/messages");
const uuid = require("uuid");

const transactionController = {
  getTransactionById: async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await transactionModel.findOne({ transactionId: id });
      if (!transaction) {
        return res
          .status(404)
          .json({ message: req.t("not_found.transaction") });
      }

      return res.status(200).json(transaction);
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  getAllTransactions: async (req, res) => {
    try {
      const { type } = req.query;
      const options = optionsPaginate(req, "");
      let results = await transactionModel.paginate({ type: type }, options);

      results.docs = await Promise.all(
        results.docs.map(async (user) => {
          return await transactionModel.populate(user, {
            path: "user recipient",
            select: "nickname",
          });
        })
      );

      return res.status(200).json({ results: results });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  getAllTransactionsByUser: async (req, res) => {
    try {
      const { request_user } = req.query;
      const options = optionsPaginate(req, "");
      const results = await transactionModel.paginate(
        { user: request_user },
        options
      );

      return res.status(200).json({ results: results });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  getAllTransactionsByRecipient: async (req, res) => {
    try {
      const { request_user } = req.query;
      const options = optionsPaginate(req, "");
      const results = await transactionModel.paginate(
        { recipient: request_user },
        options
      );

      return res.status(200).json({ results: results });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  getAllTransactionsOfUser: async (req, res) => {
    try {
      const { request_user, type } = req.query;
      const options = optionsPaginate(req, "");

      const results = await transactionModel.paginate(
        {
          $or: [{ user: request_user }, { recipient: request_user }],
          type: type,
        },
        options
      );
      results.docs = await Promise.all(
        results.docs.map(async (user) => {
          return await transactionModel.populate(user, {
            path: "user recipient",
            select: "nickname",
          });
        })
      );
      if (!results) {
        return res
          .status(404)
          .json({ message: req.t("not_found.transaction") });
      }
      return res.status(200).json({ results: results });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
  withdrawal: async (req, res) => {
    try {
      const { amount, user, informationWithdraw, message } = req.body;

      if (!amount || !user || !informationWithdraw) {
        return res
          .status(400)
          .json({ message: req.t("transaction.missing_required_fields") });
      }

      const userData = await userModel.findById(user);

      const transaction = await transactionModel.create({
        transactionId: `WW-${uuid.v4()}`,
        user: user,
        amount: amount - (amount * 5) / 100,
        informationWithdraw: informationWithdraw,
        message: message,
        type: 1,
        status: 3,
      });

      if (!transaction) {
        return res
          .status(400)
          .json({ message: req.t("transaction.create_withdrawal_failed") });
      }

      await userModel.findByIdAndUpdate(
        transaction.user,
        {
          $inc: {
            amount: -(transaction.amount / 0.95),
          },
        },
        { new: true }
      );

      const admins = await userService.getAdmins(req, res);

      admins.forEach(async (admin) => {
        const messages = {
          en: `${userData.nickname} has just created a withdrawal request!`,
          vi: `${userData.nickname} vừa tạo yêu cầu rút tiền!`,
        };
        const notification = await notificationService.createNotification(
          admin._id,
          6,
          "transactionId",
          transaction._id,
          messages,
          "https://img.upanh.tv/2024/07/09/6362437.png"
        );
        const sockets = await socketService.getSocket(admin._id);
        sockets.forEach(async (socket) => {
          global._io
            .to(socket.socketId)
            .emit("report-for-admin", messages.en, notification);
        });
      });

      return res.status(201).json({
        message: req.t("transaction.create_withdrawal_success"),
        transaction: transaction,
      });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  confirmWithdrawal: async (req, res) => {
    try {
      const { transactionId, type } = req.body;

      const transaction = await transactionModel.findOneAndUpdate(
        { transactionId: transactionId },
        {
          status: type,
        },
        { new: true }
      );

      if (!transaction) {
        return res
          .status(404)
          .json({ message: req.t("not_found.transaction") });
      }

      const user = await userModel.findById(transaction.user);

      if (type !== 1 && transaction.status === 2) {
        // refund the transaction
        await userModel.findByIdAndUpdate(
          user._id,
          {
            $inc: {
              amount: +(transaction.amount / 0.95),
            },
          },
          { new: true }
        );

        await transactionController.createNotificationAndEmit(
          user._id,
          transaction._id,
          messagesTransaction.reject,
          6,
          "https://img.upanh.tv/2024/07/09/OIPa816c82596028adb.jpg"
        );
      } else {
        await transactionController.createNotificationAndEmit(
          user._id,
          transaction._id,
          messagesTransaction.approve,
          6,
          "https://img.upanh.tv/2024/07/09/transaction_success_accepted-512.webp"
        );
      }

      return res.status(200).json({
        message:
          type === 1
            ? req.t("transaction.confirm_withdrawal_success")
            : req.t("transaction.reject_withdrawal_order"),
      });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  createNotificationAndEmit: async (
    userId,
    transactionId,
    messages,
    notificationType,
    imageUrl
  ) => {
    const notification = await notificationService.createNotification(
      userId,
      notificationType,
      "transactionId",
      transactionId,
      messages,
      imageUrl
    );
    const sockets = await socketService.getSocket(userId);

    sockets.forEach((socket) => {
      global._io
        .to(socket.socketId)
        .emit("confirm-transaction", messages.en, notification);
    });
  },
};

module.exports = transactionController;
