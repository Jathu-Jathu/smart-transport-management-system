const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    routeCode: { type: String, required: true, unique: true },
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    stops: [{ type: String }],
    totalDistanceKm: { type: Number, required: true },
    estimatedTravelTime: { type: String, required: true },
    routeStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    // Geofence center point
    centerLatitude: Number,
    centerLongitude: Number,
    allowedRadiusKm: { type: Number, default: 25 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Route", routeSchema);