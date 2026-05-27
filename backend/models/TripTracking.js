const mongoose = require("mongoose");

const tripTrackingSchema = new mongoose.Schema(
  {
    schedule: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", required: true },
    currentLocation: String,
    latitude: Number,
    longitude: Number,
    routeProgress: { type: Number, default: 0 },
    delayMinutes: { type: Number, default: 0 },
    eta: String,
    runningStatus: {
      type: String,
      enum: ["On Time", "Delayed", "Breakdown"],
      default: "On Time",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TripTracking", tripTrackingSchema);