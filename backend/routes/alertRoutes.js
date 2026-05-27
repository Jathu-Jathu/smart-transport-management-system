const express = require("express");
const { generateAlerts } = require("../controllers/alertController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/generate", protect, authorize("admin"), generateAlerts);

module.exports = router;