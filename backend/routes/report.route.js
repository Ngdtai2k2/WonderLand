const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const reportController = require("../controllers/report.controller");

router.post("/", verifyMiddleware.token, reportController.create);

module.exports = router;
