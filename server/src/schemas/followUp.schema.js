const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

const followUpBody = z.object({
  note: z.string().min(2).max(2000),
  dueAt: z.coerce.date().optional(),
  reminderAt: z.coerce.date().optional(),
  type: z.enum(["note", "call", "email", "meeting", "task"]).default("note"),
});

const createFollowUpSchema = z.object({
  params: z.object({ leadId: objectId }),
  body: followUpBody,
});

const updateFollowUpSchema = z.object({
  params: z.object({ id: objectId }),
  body: followUpBody.partial().extend({ completedAt: z.coerce.date().nullable().optional() }),
});

const idParamSchema = z.object({ params: z.object({ id: objectId }) });

module.exports = { createFollowUpSchema, updateFollowUpSchema, idParamSchema };
