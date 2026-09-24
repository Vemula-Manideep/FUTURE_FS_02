const Lead = require("../models/Lead");
const ActivityLog = require("../models/ActivityLog");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const analytics = asyncHandler(async (_req, res) => {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const [statusCounts, sourceCounts, monthly, recentActivity, totals] = await Promise.all([
    Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 }, value: { $sum: "$estimatedValue" } } }]),
    Lead.aggregate([{ $group: { _id: "$source", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 6 }]),
    Lead.aggregate([
      { $match: { createdAt: { $gte: yearStart } } },
      { $group: { _id: { month: { $month: "$createdAt" } }, leads: { $sum: 1 }, value: { $sum: "$estimatedValue" } } },
      { $sort: { "_id.month": 1 } },
    ]),
    ActivityLog.find().populate("actor", "name role").sort("-createdAt").limit(10).lean(),
    Lead.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          converted: { $sum: { $cond: [{ $eq: ["$status", "Converted"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $in: ["$status", ["New", "Contacted", "Qualified"]] }, 1, 0] } },
          revenue: { $sum: { $cond: [{ $eq: ["$status", "Converted"] }, "$estimatedValue", 0] } },
          pipelineValue: { $sum: "$estimatedValue" },
        },
      },
    ]),
  ]);

  const summary = totals[0] || { total: 0, converted: 0, pending: 0, revenue: 0, pipelineValue: 0 };
  summary.conversionRate = summary.total ? Math.round((summary.converted / summary.total) * 100) : 0;

  sendSuccess(res, 200, "Dashboard analytics fetched", {
    summary,
    statusCounts,
    sourceCounts,
    monthly: monthly.map((item) => ({ month: item._id.month, leads: item.leads, value: item.value })),
    recentActivity,
  });
});

module.exports = { analytics };
