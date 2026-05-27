const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
    conductor: { type: mongoose.Schema.Types.ObjectId, ref: "Conductor", required: true },
    date: { type: Date, required: true },
    shift: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening", "Night"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Assigned", "Completed", "Cancelled"],
      default: "Assigned",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);