const router = require("express").Router();
const zalopayController = require("../controllers/zalopay.controller");
const verifyMiddleware = require("../middleware/verifyToken");

router.post("/payment", verifyMiddleware.token, zalopayController.payment);
router.post("/callback", zalopayController.callback);
router.post(
  "/check-status",
  verifyMiddleware.token,
  zalopayController.checkStatus
);

module.exports = router;
