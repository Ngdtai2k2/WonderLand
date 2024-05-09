const router = require("express").Router();
const ruleController = require("../controllers/rule.controller");
const verifyMiddleware = require("../middleware/verifyToken");

router.get('/', ruleController.getAll);
router.post('/create', verifyMiddleware.tokenAndAdminAuth, ruleController.create);
router.put('/update/:id', verifyMiddleware.tokenAndAdminAuth, ruleController.update);
router.delete('/delete', verifyMiddleware.tokenAndAdminAuth, ruleController.delete);

module.exports = router;