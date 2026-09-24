const router = require("express").Router();
const { authenticate } = require("../middleware/auth");
const { analytics } = require("../controllers/dashboard.controller");

router.get("/analytics", authenticate, analytics);

module.exports = router;
