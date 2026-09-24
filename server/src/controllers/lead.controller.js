const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const leadService = require("../services/lead.service");

const listLeads = asyncHandler(async (req, res) => {
  const result = await leadService.listLeads(req.validated.query);
  sendSuccess(res, 200, "Leads fetched", result.items, result.meta);
});

const getLead = asyncHandler(async (req, res) => {
  const result = await leadService.getLeadDetail(req.validated.params.id);
  sendSuccess(res, 200, "Lead fetched", result);
});

const createLead = asyncHandler(async (req, res) => {
  const lead = await leadService.createLead(req.validated.body, req.user);
  sendSuccess(res, 201, "Lead created", lead);
});

const updateLead = asyncHandler(async (req, res) => {
  const lead = await leadService.updateLead(req.validated.params.id, req.validated.body, req.user);
  sendSuccess(res, 200, "Lead updated", lead);
});

const deleteLead = asyncHandler(async (req, res) => {
  await leadService.deleteLead(req.validated.params.id, req.user);
  sendSuccess(res, 200, "Lead deleted");
});

const bulkUpdate = asyncHandler(async (req, res) => {
  const result = await leadService.bulkUpdateLeads(req.body, req.user);
  sendSuccess(res, 200, "Bulk update completed", result);
});

module.exports = { listLeads, getLead, createLead, updateLead, deleteLead, bulkUpdate };
