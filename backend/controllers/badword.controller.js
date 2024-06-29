const optionsPaginate = require("../configs/optionsPaginate");
const badwordModel = require("../models/badword.model");

const badwordController = {
  create: async (req, res) => {
    try {
      const { word } = req.body;

      const existingWord = await badwordModel.findOne({ word });
      if (existingWord) {
        return res.status(400).json({ message: req.t("badword.exists") });
      }

      const newBadWord = new badwordModel({ word });
      await newBadWord.save();

      return res
        .status(201)
        .json({ newBadWord, message: req.t("badword.add_success") });
    } catch (err) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
  deleteWord: async (req, res) => {
    try {
      const { id } = req.params;
      await badwordModel.findByIdAndDelete(id);
      return res.status(200).json({ message: req.t("badword.delete_success") });
    } catch (err) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { word } = req.body;

      const data = await badwordModel.findByIdAndUpdate(id, { word });
      if (!data) {
        return res.status(404).json({ message: req.t("not_found.badword") });
      }
      return res
        .status(200)
        .json({ message: req.t("badword.update_success"), result: data });
    } catch (err) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
  getAll: async (req, res) => {
    try {
      const options = optionsPaginate(req, "");
      const results = await badwordModel.paginate({}, options);

      return res.status(200).json({ results: results });
    } catch (err) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
  checkExists: async (req, res) => {
    try {
      const { word } = req.query;

      const existingWord = await badwordModel.findOne({ word });
      if (existingWord) {
        return res
          .status(200)
          .json({ exists: true, message: req.t("badword.exists") });
      } else {
        return res.status(200).json({ exists: false });
      }
    } catch (err) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
};

module.exports = badwordController;
