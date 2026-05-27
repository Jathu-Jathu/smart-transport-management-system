const mongoose = require("mongoose");

const fuelSchema = new mongoose.Schema(
  {
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    fuelFilledLiters: { type: Number, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    odometerKm: Number,
    fuelEfficiency: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fuel", fuelSchema);