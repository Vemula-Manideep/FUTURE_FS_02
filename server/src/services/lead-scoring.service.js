const statusWeight = {
  New: 5,
  Contacted: 15,
  Qualified: 35,
  "Proposal Sent": 55,
  Negotiation: 70,
  Converted: 100,
  Lost: 0,
};

const priorityWeight = {
  Low: 0,
  Medium: 8,
  High: 15,
  Urgent: 22,
};

const sourceWeight = {
  Referral: 12,
  Website: 8,
  LinkedIn: 6,
  "Email Campaign": 4,
  Event: 7,
  "Cold Call": 2,
  Other: 0,
};

const calculateLeadScore = (lead) => {
  const valueScore = Math.min(20, Math.floor((lead.estimatedValue || 0) / 25000));
  const tagScore = Math.min(10, (lead.tags || []).length * 2);
  const hasContactScore = lead.client?.email || lead.client?.phone ? 8 : 0;

  return Math.min(
    100,
    (statusWeight[lead.status] || 0) +
      (priorityWeight[lead.priority] || 0) +
      (sourceWeight[lead.source] || 0) +
      valueScore +
      tagScore +
      hasContactScore
  );
};

module.exports = { calculateLeadScore };
