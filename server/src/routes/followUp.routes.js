const router = require("express").Router();
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const { createFollowUpSchema, updateFollowUpSchema, idParamSchema } = require("../schemas/followUp.schema");
const controller = require("../controllers/followUp.controller");

router.use(authenticate);
router.post("/lead/:leadId", validate(createFollowUpSchema), controller.createFollowUp);
router.patch("/:id", validate(updateFollowUpSchema), controller.updateFollowUp);
router.delete("/:id", validate(idParamSchema), controller.deleteFollowUp);

module.exports = router;
