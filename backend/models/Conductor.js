const mongoose = require("mongoose");

const conductorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    emergencyContact: String,
    availability: {
      type: String,
      enum: ["Available", "Assigned", "On Leave"],
      default: "Available",
    },
    assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
    shiftTiming: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conductor", conductorSchema);