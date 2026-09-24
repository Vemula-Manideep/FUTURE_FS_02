const mongoose = require("mongoose");

const leadStatuses = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Converted",
  "Lost",
];

const communicationSchema = new mongoose.Schema(
  {
    channel: { type: String, enum: ["email", "phone", "meeting", "whatsapp", "other"], default: "other" },
    summary: { type: String, required: true, trim: true, maxlength: 1000 },
    direction: { type: String, enum: ["inbound", "outbound"], default: "outbound" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const leadSchema = new mongoose.Schema(
  {
    client: {
      name: { type: String, required: true, trim: true, index: "text" },
      company: { type: String, trim: true, index: "text" },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    source: {
      type: String,
      enum: ["Website", "Referral", "LinkedIn", "Cold Call", "Email Campaign", "Event", "Other"],
      default: "Website",
      index: true,
    },
    status: { type: String, enum: leadStatuses, default: "New", index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium", index: true },
    score: { type: Number, min: 0, max: 100, default: 0, index: true },
    estimatedValue: { type: Number, min: 0, default: 0 },
    expectedCloseDate: Date,
    communicationHistory: [communicationSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

leadSchema.index({ "client.name": "text", "client.company": "text", "client.email": "text", tags: "text" });
leadSchema.index({ status: 1, assignedTo: 1, updatedAt: -1 });
leadSchema.index({ score: -1, estimatedValue: -1 });

leadSchema.virtual("isWon").get(function isWon() {
  return this.status === "Converted";
});

module.exports = mongoose.model("Lead", leadSchema);
module.exports.leadStatuses = leadStatuses;
