const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: String,
    email: String,
    complaints: [{ message: String, date: Date }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Passenger", passengerSchema);