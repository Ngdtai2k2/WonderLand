const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const categoriesController = require("../controllers/categories.controller");
const storage = require("../configs/multer.config");
const verifyTokenAndAdminAuth = verifyMiddleware.tokenAndAdminAuth;

router.get("/", categoriesController.getAllCategories);
router.post(
  "/create",
  storage.single("file"),
  verifyTokenAndAdminAuth,
  categoriesController.create
);
router.put(
  "/update/:id",
  storage.single("file"),
  verifyTokenAndAdminAuth,
  categoriesController.updateCategory
);
router.delete(
  "/delete/:id",
  verifyTokenAndAdminAuth,
  categoriesController.deleteCategory
);
router.post("/details", categoriesController.getCategoryDetails);
router.post(
  "/like/:categoryName",
  verifyMiddleware.token,
  categoriesController.handleLikeCategory
);
router.post(
  "/follow/:categoryName",
  verifyMiddleware.token,
  categoriesController.handleFollowCategory
);

module.exports = router;
