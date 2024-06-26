const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const messageController = require("../controllers/message.controller");
const storage = require("../configs/multer.config");

router.post(
  "/",
  verifyMiddleware.token,
  storage.single("file"),
  messageController.addMessage
);
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
