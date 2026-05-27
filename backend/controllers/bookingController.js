const QRCode = require("qrcode");
const Booking = require("../models/Booking");

exports.createBooking = async (req, res, next) => {
  try {
    const { passenger, schedule, seatNumber, paymentStatus, bookingStatus } = req.body;

    const existingSeat = await Booking.findOne({
      schedule,
      seatNumber,
      bookingStatus: { $ne: "Cancelled" },
    });

    if (existingSeat) {
      return res.status(400).json({
        success: false,
        message: `Seat ${seatNumber} is already booked for this schedule`,
      });
    }

    const ticketCode = `RUDRA-${Date.now()}-${seatNumber}`;

    const qrPayload = {
      ticketCode,
      passenger,
      schedule,
      seatNumber,
      brand: "RUDRA EXPRESS",
    };

    const ticketQr = await QRCode.toDataURL(JSON.stringify(qrPayload));

    const booking = await Booking.create({
      passenger,
      schedule,
      seatNumber,
      paymentStatus,
      bookingStatus,
      ticketCode,
      ticketQr,
    });

    const populated = await Booking.findById(booking._id)
      .populate("passenger")
      .populate({
        path: "schedule",
        populate: ["bus", "route"],
      });

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("passenger")
      .populate({
        path: "schedule",
        populate: ["bus", "route"],
      });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("passenger")
      .populate({
        path: "schedule",
        populate: ["bus", "route"],
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      message: "Booking deleted",
    });
  } catch (err) {
    next(err);
  }
};