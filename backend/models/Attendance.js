const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    staffType: {
      type: String,
      enum: ["Driver", "Conductor"],
      required: true,
    },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    conductor: { type: mongoose.Schema.Types.ObjectId, ref: "Conductor" },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Present", "Absent", "Leave"],
      required: true,
    },
    shiftTiming: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);