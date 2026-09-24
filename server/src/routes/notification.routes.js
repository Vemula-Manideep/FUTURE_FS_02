const router = require("express").Router();
const { authenticate } = require("../middleware/auth");
const controller = require("../controllers/notification.controller");

router.use(authenticate);
router.get("/", controller.listNotifications);
router.patch("/:id/read", controller.markRead);

module.exports = router;
