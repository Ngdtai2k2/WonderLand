const uuid = require("uuid");
const axios = require("axios").default;
const moment = require("moment");
const CryptoJS = require("crypto-js");
const qs = require("qs");

const transactionModel = require("../models/transaction.model");

const zalopayConfig = require("../configs/zalopay.config");
const userModel = require("../models/user.model");

const zalopayController = {
  payment: async (req, res) => {
    const { amount, app_user, message, recipient } = req.body;

    const embed_data = {
      redirecturl: zalopayConfig.redirecturl,
    };

    const items = [];

    const transID = uuid
      .v4()
      .replace(/[^0-9]/g, "")
      .substring(0, 6);

    const order = {
      app_id: zalopayConfig.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
      app_user: app_user,
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: amount,
      callback_url: zalopayConfig.callbackurl,
      description: message,
      bank_code: "",
    };

    const data =
      zalopayConfig.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, zalopayConfig.key1).toString();

    try {
      const result = await axios.post(
        `${zalopayConfig.endpoint}/create`,
        null,
        { params: order }
      );

      const transaction = new transactionModel({
        user: order.app_user,
        recipient: recipient,
        transactionId: order.app_trans_id,
        amount: order.amount,
        message: order.description,
        status: 3,
        type: 0,
        url: result.data.order_url,
      });

      await transaction.save();

      return res.status(200).json(result.data);
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  callback: async (req, res) => {
    let result = {};

    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;

      let mac = CryptoJS.HmacSHA256(dataStr, zalopayConfig.key2).toString();

      if (reqMac !== mac) {
        result.return_code = -1;
        result.return_message = "mac not equal";
      } else {
        result.return_code = 1;
        result.return_message = "success";
      }
    } catch (error) {
      result.return_code = 0;
      result.return_message = error.message;
      return res.status(500).json({ message: req.t("server_error") });
    }

    res.json(result);
  },

  checkStatus: async (req, res) => {
    const { app_trans_id } = req.body;

    let postData = {
      app_id: zalopayConfig.app_id,
      app_trans_id,
    };

    let data =
      postData.app_id + "|" + postData.app_trans_id + "|" + zalopayConfig.key1;
    postData.mac = CryptoJS.HmacSHA256(data, zalopayConfig.key1).toString();

    let postConfig = {
      method: "post",
      url: `${zalopayConfig.endpoint}/query`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify(postData),
    };

    try {
      const result = await axios(postConfig);

      if (result.data.return_code === 1) {
        const transaction = await transactionModel.findOneAndUpdate(
          { transactionId: app_trans_id },
          { status: result.data.return_code },
          { new: true }
        );

        if (!transaction) {
          return res.status(404).json({
            sub_return_message: req.t("not_found.transaction"),
            return_code: 2,
          });
        }

        await userModel.findByIdAndUpdate(
          transaction.recipient,
          {
            $inc: { amount: +transaction.amount },
          },
          { new: true }
        );

        return res
          .status(200)
          .json({ result: result.data, message: req.t("transaction.success") });
      } else {
        let message = req.t("transaction.pending");
        if (result.data.return_code === 2) {
          message = req.t("transaction.fail");
        }

        return res.status(200).json({ result: result.data, message });
      }
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
};

module.exports = zalopayController;
