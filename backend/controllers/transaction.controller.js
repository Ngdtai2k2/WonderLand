const transactionModel = require("../models/transaction.model");

const transactionController = {
  getTransactionById: async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await transactionModel.findOne({ transactionId: id });
      if (!transaction) {
        return res
          .status(404)
          .json({ message: req.t("not_found:transaction") });
      }

      return res.status(200).json(transaction);
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
  getAllTransactions: async (req, res) => {
    try {
      const options = optionsPaginate(req, "");
      const results = await transactionModel.paginate({}, options);

      return res.status(200).json({ results: results });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
  getAllTransactionsByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const options = optionsPaginate(req, "");
      const results = await transactionModel.paginate(
        { user: userId },
        options
      );

      return res.status(200).json({ results: results });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
  getAllTransactionsByRecipient: async (req, res) => {
    try {
      const { recipientId } = req.params;
      const options = optionsPaginate(req, "");
      const results = await transactionModel.paginate(
        { recipient: recipientId },
        options
      );

      return res.status(200).json({ results: results });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
};

module.exports = transactionController;
