const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const reportController = require("../controllers/report.controller");

router.get("/", verifyMiddleware.tokenAndAdminAuth, reportController.getAll);
router.post("/create", verifyMiddleware.token, reportController.create);
router.post("/:id/reject",  reportController.rejectedReport)

module.exports = router;
