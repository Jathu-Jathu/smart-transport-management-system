const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busNumber: { type: String, required: true, unique: true },
    busName: { type: String, required: true },
    busType: {
      type: String,
      enum: ["AC", "Non-AC", "Luxury", "Sleeper"],
      required: true,
    },
    totalSeats: { type: Number, required: true },
    capacity: { type: Number, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    fuelType: {
      type: String,
      enum: ["Diesel", "Petrol", "Hybrid", "Electric"],
      default: "Diesel",
    },
    maintenanceStatus: {
      type: String,
      enum: ["Available", "Under Maintenance", "Breakdown"],
      default: "Available",
    },
    insuranceExpiry: Date,
    licenseRenewalDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", busSchema);