const router = require("express").Router();
const searchController = require("../controllers/search.controller");

router.post("/users", searchController.users);
router.post("/posts", searchController.posts);

module.exports = router;