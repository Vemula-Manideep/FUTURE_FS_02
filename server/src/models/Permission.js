const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["Admin", "Manager", "Sales Executive"], required: true, unique: true },
    grants: [{ type: String, required: true, trim: true }],
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permission", permissionSchema);
