const router = require("express").Router();
const notificationController = require("../controllers/notification.controller");

router.post(
  "/read-notification",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  notificationController.read
);

module.exports = router;
