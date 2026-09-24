const { z } = require("zod");
const { leadStatuses } = require("../models/Lead");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

const clientSchema = z.object({
  name: z.string().min(2).max(120),
  company: z.string().max(120).optional().default(""),
  email: z.email().optional().or(z.literal("")),
  phone: z.string().max(30).optional().default(""),
  website: z.string().url().optional().or(z.literal("")).default(""),
});

const leadBody = z.object({
  client: clientSchema,
  source: z.enum(["Website", "Referral", "LinkedIn", "Cold Call", "Email Campaign", "Event", "Other"]).default("Website"),
  status: z.enum(leadStatuses).optional(),
  assignedTo: objectId.optional(),
  tags: z.array(z.string().min(1).max(30)).default([]),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).default("Medium"),
  estimatedValue: z.number().min(0).default(0),
  expectedCloseDate: z.coerce.date().optional(),
});

const createLeadSchema = z.object({ body: leadBody });
const updateLeadSchema = z.object({
  params: z.object({ id: objectId }),
  body: leadBody.partial(),
});

const listLeadsSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    status: z.enum(leadStatuses).optional(),
    source: z.string().optional(),
    priority: z.string().optional(),
    assignedTo: objectId.optional(),
    sort: z.string().optional().default("-createdAt"),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
  }),
});

const idParamSchema = z.object({ params: z.object({ id: objectId }) });

module.exports = { createLeadSchema, updateLeadSchema, listLeadsSchema, idParamSchema };
