const router = require("express").Router();
const notificationController = require("../controllers/notification.controller");
const verifyMiddleware = require("../middleware/verifyToken");

router.post(
  "/read-notification",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  notificationController.read
);
router.post(
  "/count-unread",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  notificationController.countUnreadNotifications
);
router.post(
  "/user",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  notificationController.getNotificationByUserId
);

module.exports = router;
