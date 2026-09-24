const FollowUp = require("../models/FollowUp");
const Lead = require("../models/Lead");
const Notification = require("../models/Notification");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { logActivity } = require("../services/activity.service");

const createFollowUp = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.validated.params.leadId);
  if (!lead) throw new ApiError(404, "Lead not found");

  const followUp = await FollowUp.create({
    ...req.validated.body,
    lead: lead._id,
    createdBy: req.user._id,
  });

  if (req.validated.body.reminderAt && lead.assignedTo) {
    await Notification.create({
      user: lead.assignedTo,
      title: "Follow-up reminder scheduled",
      body: req.validated.body.note,
      type: "reminder",
      lead: lead._id,
    });
  }

  await logActivity({ actor: req.user._id, action: "followup.created", entityType: "FollowUp", entityId: followUp._id });
  sendSuccess(res, 201, "Follow-up created", followUp);
});

const updateFollowUp = asyncHandler(async (req, res) => {
  const followUp = await FollowUp.findByIdAndUpdate(req.validated.params.id, req.validated.body, {
    new: true,
    runValidators: true,
  });
  if (!followUp) throw new ApiError(404, "Follow-up not found");
  await logActivity({ actor: req.user._id, action: "followup.updated", entityType: "FollowUp", entityId: followUp._id });
  sendSuccess(res, 200, "Follow-up updated", followUp);
});

const deleteFollowUp = asyncHandler(async (req, res) => {
  const followUp = await FollowUp.findByIdAndDelete(req.validated.params.id);
  if (!followUp) throw new ApiError(404, "Follow-up not found");
  await logActivity({ actor: req.user._id, action: "followup.deleted", entityType: "FollowUp", entityId: followUp._id });
  sendSuccess(res, 200, "Follow-up deleted");
});

module.exports = { createFollowUp, updateFollowUp, deleteFollowUp };
