const friendsModel = require("../models/friends.model");
const userModel = require("../models/user.model");

const friendService = {
  count: async (userId, req, res) => {
    const user = await userModel.findById(userId);
    if (!user)
      return res.status(404).json({ message: req.t("not_found.user") });

    const count = await friendsModel.countDocuments({
      $or: [
        { user: userId, status: 1 },
        { friend: userId, status: 1 },
      ],
    });
    return count;
  },
};

module.exports = friendService;
