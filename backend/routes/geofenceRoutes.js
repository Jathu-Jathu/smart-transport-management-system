const express = require("express");
const { checkGeofence } = require("../controllers/geofenceController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/check", protect, authorize("admin"), checkGeofence);

module.exports = router;