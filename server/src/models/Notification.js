const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, trim: true },
    type: { type: String, enum: ["reminder", "assignment", "system"], default: "system" },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    readAt: Date,
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, readAt: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
