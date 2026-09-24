const Lead = require("../models/Lead");

const buildLeadFilter = (query) => {
  const filter = {};
  if (query.q) filter.$text = { $search: query.q };
  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;
  if (query.priority) filter.priority = query.priority;
  if (query.assignedTo) filter.assignedTo = query.assignedTo;
  return filter;
};

const findPaginated = async (query) => {
  const filter = buildLeadFilter(query);
  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    Lead.find(filter)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email")
      .sort(query.sort)
      .skip(skip)
      .limit(query.limit)
      .lean({ virtuals: true }),
    Lead.countDocuments(filter),
  ]);

  return { items, total, page: query.page, limit: query.limit };
};

const findByIdWithPeople = (id) =>
  Lead.findById(id).populate("assignedTo", "name email role").populate("createdBy", "name email").lean({ virtuals: true });

const create = (payload) => Lead.create(payload);
const findById = (id) => Lead.findById(id);
const deleteById = (id) => Lead.findByIdAndDelete(id);
const bulkUpdate = (ids, patch) => Lead.updateMany({ _id: { $in: ids } }, patch);

module.exports = { buildLeadFilter, findPaginated, findByIdWithPeople, create, findById, deleteById, bulkUpdate };
