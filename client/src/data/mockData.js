export const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Converted", "Lost"];

export const mockAnalytics = {
  summary: { total: 248, converted: 64, pending: 91, revenue: 4280000, pipelineValue: 11450000, conversionRate: 26 },
  statusCounts: [
    { _id: "New", count: 42, value: 1100000 },
    { _id: "Contacted", count: 36, value: 980000 },
    { _id: "Qualified", count: 55, value: 2750000 },
    { _id: "Proposal Sent", count: 31, value: 2100000 },
    { _id: "Negotiation", count: 20, value: 1740000 },
    { _id: "Converted", count: 64, value: 4280000 },
  ],
  sourceCounts: [
    { _id: "Website", count: 86 },
    { _id: "LinkedIn", count: 54 },
    { _id: "Referral", count: 42 },
    { _id: "Email Campaign", count: 31 },
    { _id: "Cold Call", count: 22 },
  ],
  monthly: [
    { month: 1, leads: 14, value: 520000 },
    { month: 2, leads: 22, value: 860000 },
    { month: 3, leads: 28, value: 1250000 },
    { month: 4, leads: 36, value: 1680000 },
    { month: 5, leads: 41, value: 2210000 },
    { month: 6, leads: 38, value: 1910000 },
  ],
  recentActivity: [
    { _id: "1", action: "lead.updated", actor: { name: "Mira Manager", role: "Manager" }, createdAt: new Date().toISOString() },
    { _id: "2", action: "followup.created", actor: { name: "Aarav Admin", role: "Admin" }, createdAt: new Date().toISOString() },
  ],
};

export const mockLeads = [
  {
    _id: "1",
    client: { name: "Rohan Mehta", company: "Northstar Labs", email: "rohan@northstar.test", phone: "+91 90000 00001" },
    source: "Website",
    status: "Qualified",
    assignedTo: { name: "Mira Manager" },
    priority: "High",
    estimatedValue: 180000,
    updatedAt: new Date().toISOString(),
    tags: ["saas", "hot"],
  },
  {
    _id: "2",
    client: { name: "Priya Shah", company: "BluePeak Media", email: "priya@bluepeak.test", phone: "+91 90000 00002" },
    source: "LinkedIn",
    status: "Proposal Sent",
    assignedTo: { name: "Mira Manager" },
    priority: "Medium",
    estimatedValue: 95000,
    updatedAt: new Date().toISOString(),
    tags: ["agency"],
  },
  {
    _id: "3",
    client: { name: "Kabir Rao", company: "UrbanNest", email: "kabir@urbannest.test", phone: "+91 90000 00003" },
    source: "Referral",
    status: "Negotiation",
    assignedTo: { name: "Aarav Admin" },
    priority: "Urgent",
    estimatedValue: 320000,
    updatedAt: new Date().toISOString(),
    tags: ["real-estate"],
  },
];
