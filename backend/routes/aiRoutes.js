const express = require("express");
const {
  predictiveMaintenance,
  driverFatigue,
  routeOptimization,
} = require("../controllers/aiController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/predictive-maintenance", protect, authorize("admin"), predictiveMaintenance);
router.get("/driver-fatigue", protect, authorize("admin"), driverFatigue);
router.get("/route-optimization", protect, authorize("admin"), routeOptimization);

module.exports = router;