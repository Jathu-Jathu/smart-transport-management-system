const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    breakdownTime: Date,
    location: String,
    issueType: {
      type: String,
      enum: ["Breakdown", "Accident", "Delay", "Technical Issue", "Other"],
      default: "Other",
    },
    description: String,
    assignedMechanic: String,
    resolvedStatus: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Incident", incidentSchema);