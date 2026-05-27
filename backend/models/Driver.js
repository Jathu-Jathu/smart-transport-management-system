const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    experienceYears: Number,
    emergencyContact: String,
    availability: {
      type: String,
      enum: ["Available", "Assigned", "On Leave"],
      default: "Available",
    },
    assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
    assignedRoute: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
    licenseExpiry: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);