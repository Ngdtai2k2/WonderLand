const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const savePost = require("../controllers/savePostController");

router.post("/", verifyMiddleware.token, savePost.handleSavePost);

module.exports = router;