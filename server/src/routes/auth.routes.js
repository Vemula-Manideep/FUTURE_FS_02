const router = require("express").Router();
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const { authLimiter } = require("../middleware/security");
const { registerSchema, loginSchema, forgotPasswordSchema } = require("../schemas/auth.schema");
const controller = require("../controllers/auth.controller");

router.post("/register", authLimiter, validate(registerSchema), controller.register);
router.post("/login", authLimiter, validate(loginSchema), controller.login);
router.post("/refresh", authLimiter, controller.refresh);
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), controller.forgotPassword);
router.get("/me", authenticate, controller.me);
router.post("/logout", authenticate, controller.logout);

module.exports = router;
