const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ["Admin", "Manager", "Sales Executive"], required: true },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    settings: {
      timezone: { type: String, default: "Asia/Kolkata" },
      defaultLeadOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      leadScoringEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

teamSchema.index({ "members.user": 1 });

module.exports = mongoose.model("Team", teamSchema);
