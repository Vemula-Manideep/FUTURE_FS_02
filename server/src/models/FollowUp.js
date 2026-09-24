const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
  {
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    note: { type: String, required: true, trim: true, maxlength: 2000 },
    dueAt: { type: Date, index: true },
    completedAt: Date,
    reminderAt: Date,
    type: { type: String, enum: ["note", "call", "email", "meeting", "task"], default: "note" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

followUpSchema.index({ lead: 1, createdAt: -1 });
followUpSchema.index({ createdBy: 1, dueAt: 1, completedAt: 1 });

module.exports = mongoose.model("FollowUp", followUpSchema);
