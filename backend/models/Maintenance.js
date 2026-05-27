const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    serviceDate: { type: Date, required: true },
    oilChange: { type: Boolean, default: false },
    tireReplacement: { type: Boolean, default: false },
    brakeCheck: { type: Boolean, default: false },
    repairIssues: String,
    maintenanceCost: { type: Number, default: 0 },
    nextServiceDue: Date,
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);