const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const messageController = require("../controllers/message.controller");

router.post("/", verifyMiddleware.token, messageController.addMessage);
router.post(
  "/count-unread",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  messageController.countUnread
);
router.post(
  "/mark-message",
  verifyMiddleware.verifyTokenAndUserAuthorization,
  messageController.markMessagesByChat
);
router.post("/:chatId", verifyMiddleware.token, messageController.getMessages);

module.exports = router;
