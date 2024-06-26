const userModel = require("../models/user.model");

const userService = {
  getAdmins: async (req, res) => {
    try {
      const users = await userModel.find({ isAdmin: true });
      return users;
    } catch (error) {
      return res
        .status(500)
        .json({ message: req.t("server_error") });
    }
  },
};

module.exports = userService;
