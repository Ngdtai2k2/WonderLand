const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const savePostController = require("../controllers/savePostController");

router.post("/", verifyMiddleware.token, savePostController.handleSavePost);
router.post("/post", savePostController.getSavePostByUser);

module.exports = router;