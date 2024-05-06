
const notificationController = {
  read: async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await Notification.findById(id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found!" });
      }
      notification.read = true;
      await notification.save();
      return res.status(200).json({ message: "Notification read!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
};

module.exports = notificationController;
