const leadRepository = require("../repositories/lead.repository");
const FollowUp = require("../models/FollowUp");
const Notification = require("../models/Notification");
const ApiError = require("../utils/ApiError");
const { logActivity } = require("./activity.service");
const { calculateLeadScore } = require("./lead-scoring.service");
const { getJSON, setJSON, deleteByPattern } = require("./cache.service");
const { emitWorkspaceEvent } = require("../realtime/socket");

const listLeads = async (query) => {
  const cacheKey = `leads:${JSON.stringify(query)}`;
  const cached = await getJSON(cacheKey);
  if (cached) return cached;

  const result = await leadRepository.findPaginated(query);
  const payload = {
    items: result.items,
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      pages: Math.ceil(result.total / result.limit),
    },
  };
  await setJSON(cacheKey, payload, 45);
  return payload;
};

const getLeadDetail = async (id) => {
  const lead = await leadRepository.findByIdWithPeople(id);
  if (!lead) throw new ApiError(404, "Lead not found");
  const followUps = await FollowUp.find({ lead: lead._id }).populate("createdBy", "name email").sort("-createdAt").lean();
  return { lead, followUps };
};

const createLead = async (payload, actor) => {
  const score = calculateLeadScore(payload);
  const lead = await leadRepository.create({ ...payload, score, createdBy: actor._id });

  if (lead.assignedTo) {
    await Notification.create({
      user: lead.assignedTo,
      title: "New lead assigned",
      body: `${lead.client.name} has been assigned to you.`,
      type: "assignment",
      lead: lead._id,
    });
  }

  await Promise.all([
    deleteByPattern("leads:*"),
    logActivity({ actor: actor._id, action: "lead.created", entityType: "Lead", entityId: lead._id, metadata: { score } }),
  ]);
  emitWorkspaceEvent("default", "lead:created", { leadId: lead._id, client: lead.client, score });
  return lead;
};

const updateLead = async (id, payload, actor) => {
  const lead = await leadRepository.findById(id);
  if (!lead) throw new ApiError(404, "Lead not found");

  Object.assign(lead, payload);
  lead.score = calculateLeadScore(lead);
  await lead.save();

  await Promise.all([
    deleteByPattern("leads:*"),
    logActivity({
      actor: actor._id,
      action: "lead.updated",
      entityType: "Lead",
      entityId: lead._id,
      metadata: { changedFields: Object.keys(payload), score: lead.score },
    }),
  ]);
  emitWorkspaceEvent("default", "lead:updated", { leadId: lead._id, status: lead.status, score: lead.score });
  return lead;
};

const deleteLead = async (id, actor) => {
  const lead = await leadRepository.deleteById(id);
  if (!lead) throw new ApiError(404, "Lead not found");
  await Promise.all([
    FollowUp.deleteMany({ lead: lead._id }),
    deleteByPattern("leads:*"),
    logActivity({ actor: actor._id, action: "lead.deleted", entityType: "Lead", entityId: lead._id }),
  ]);
  emitWorkspaceEvent("default", "lead:deleted", { leadId: lead._id });
};

const bulkUpdateLeads = async ({ ids, status, assignedTo }, actor) => {
  if (!Array.isArray(ids) || ids.length === 0) throw new ApiError(400, "ids array is required");
  const patch = {};
  if (status) patch.status = status;
  if (assignedTo) patch.assignedTo = assignedTo;
  const result = await leadRepository.bulkUpdate(ids, patch);
  await Promise.all([
    deleteByPattern("leads:*"),
    logActivity({ actor: actor._id, action: "lead.bulk_updated", entityType: "Lead", entityId: ids[0], metadata: { count: ids.length, patch } }),
  ]);
  emitWorkspaceEvent("default", "lead:bulk_updated", { ids, patch });
  return result;
};

module.exports = { listLeads, getLeadDetail, createLead, updateLead, deleteLead, bulkUpdateLeads };
