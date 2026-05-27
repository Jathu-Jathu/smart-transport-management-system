const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: "Passenger", required: true },
    schedule: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", required: true },
    seatNumber: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    ticketQr: String,
    ticketCode: { type: String, unique: true },
    bookingStatus: {
      type: String,
      enum: ["Booked", "Cancelled", "Completed"],
      default: "Booked",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);