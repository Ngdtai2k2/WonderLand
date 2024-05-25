const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const socketController = require("../controllers/socket.controller");

router.post("/online", verifyMiddleware.token, socketController.checkOnline);

module.exports = router;
