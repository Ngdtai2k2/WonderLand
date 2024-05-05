const router = require("express").Router();
const verifyMiddleware = require("../middleware/verifyToken");
const categoriesController = require("../controllers/categoriesController");
const storage = require("../configs/multer");
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

module.exports = router;
