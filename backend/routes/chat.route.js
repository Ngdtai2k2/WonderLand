const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const chatController = require("../controllers/chat.controller");

router.post("/", verifyMiddleware.token, chatController.create);
router.post("/:userId", verifyMiddleware.token, chatController.userChats);
router.post(
  "/find/:firstId/:secondId",
  verifyMiddleware.token,
  chatController.findChat
);
router.put(
  "/delete/:chatId",
  verifyMiddleware.token,
  chatController.deleteChat
);

module.exports = router;
