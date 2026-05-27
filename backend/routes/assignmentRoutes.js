const express = require("express");
const {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(protect, getAssignments)
  .post(protect, authorize("admin"), createAssignment);

router
  .route("/:id")
  .put(protect, authorize("admin"), updateAssignment)
  .delete(protect, authorize("admin"), deleteAssignment);

module.exports = router;