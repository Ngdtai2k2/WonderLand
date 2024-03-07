const router = require("express").Router();

const verifyMiddleware = require("../middleware/verifyToken");
const postController = require("../controllers/postController");

router.get("/", postController.getAllPost);
router.get("/:id", postController.getPostWithMediaById);
router.post("/create", verifyMiddleware.token, postController.createPost);

module.exports = router;
