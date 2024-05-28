const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const messageController = require("../controllers/message.controller");

router.post('/', verifyMiddleware.token, messageController.addMessage);
router.get('/:chatId', verifyMiddleware.token, messageController.getMessages);

module.exports = router;