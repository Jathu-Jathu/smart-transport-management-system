const express = require("express");
const {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(protect, getBookings)
  .post(protect, authorize("admin", "passenger"), createBooking);

router
  .route("/:id")
  .get(protect, getBooking)
  .put(protect, authorize("admin"), updateBooking)
  .delete(protect, authorize("admin"), deleteBooking);

module.exports = router;