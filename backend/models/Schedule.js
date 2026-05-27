const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    conductor: { type: mongoose.Schema.Types.ObjectId, ref: "Conductor" },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    pickupTime: String,
    dropTime: String,
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Scheduled", "Running", "Delayed", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);