const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const badwordController = require("../controllers/badword.controller");

router.get("/", verifyMiddleware.tokenAndAdminAuth, badwordController.getAll);
router.post("/add", verifyMiddleware.tokenAndAdminAuth, badwordController.create);
router.put("/update/:id", verifyMiddleware.tokenAndAdminAuth, badwordController.update);
router.delete("/delete/:id", verifyMiddleware.tokenAndAdminAuth, badwordController.deleteWord);
router.post("/check-exists", verifyMiddleware.tokenAndAdminAuth, badwordController.checkExists);

module.exports = router;