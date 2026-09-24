const router = require("express").Router();
const validate = require("../middleware/validate");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { createLeadSchema, updateLeadSchema, listLeadsSchema, idParamSchema } = require("../schemas/lead.schema");
const controller = require("../controllers/lead.controller");

router.use(authenticate);
router.get("/", validate(listLeadsSchema), controller.listLeads);
router.post("/", authorizeRoles("Admin", "Manager", "Sales Executive"), validate(createLeadSchema), controller.createLead);
router.patch("/bulk", authorizeRoles("Admin", "Manager"), controller.bulkUpdate);
router.get("/:id", validate(idParamSchema), controller.getLead);
router.patch("/:id", validate(updateLeadSchema), controller.updateLead);
router.delete("/:id", authorizeRoles("Admin", "Manager"), validate(idParamSchema), controller.deleteLead);

module.exports = router;
