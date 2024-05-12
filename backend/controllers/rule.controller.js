const optionsPaginate = require("../configs/optionsPaginate");

const ruleModel = require("../models/rule.model");

const ruleController = {
  create: async (req, res) => {
    try {
      let { name, description } = req.body;

      name = name.trim();
      description = description.trim();

      if (!name || !description) {
        return res
          .status(400)
          .json({ message: "Name and description are required." });
      }

      const uniqueName = await ruleModel.findOne({ name: name });
      if (uniqueName) {
        return res.status(400).json({ message: "Rule name already exists!" });
      }

      const newRule = new ruleModel({
        name: name,
        description: description,
      });
      const rule = await newRule.save();
      return res
        .status(201)
        .json({ message: "Rule created successfully!", rule });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const rule = await ruleModel.findByIdAndDelete(id);
      if (!rule) {
        return res.status(404).json({ message: "Rule not found!" });
      }
      return res.status(200).json({ message: "Rule deleted successfully!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
  getAll: async (req, res) => {
    try {
      const options = optionsPaginate(req);
      const result = await ruleModel.paginate({}, options);

      return res.status(200).json({ result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      let { name, description } = req.body;

      name = name.trim();
      description = description.trim();

      if (!name || !description) {
        return res
          .status(400)
          .json({ message: "Name and description are required." });
      }

      const uniqueName = await ruleModel.findOne({ name: name });
      if (uniqueName) {
        return res.status(400).json({ message: "Rule name already exists!" });
      }

      const rule = await ruleModel.findByIdAndUpdate(id, {
        name: name,
        description: description,
      });

      if (!rule) {
        return res.status(404).json({ message: "Rule not found!" });
      }

      return res.status(200).json({ message: "Rule updated successfully!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
};

module.exports = ruleController;
