const Assignment = require("../models/Assignment");
const Bus = require("../models/Bus");
const Driver = require("../models/Driver");
const Conductor = require("../models/Conductor");

exports.createAssignment = async (req, res, next) => {
  try {
    const { bus, route, driver, conductor, date, shift } = req.body;

    const selectedBus = await Bus.findById(bus);
    if (!selectedBus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    if (selectedBus.maintenanceStatus !== "Available") {
      return res.status(400).json({
        success: false,
        message: "This bus is under maintenance or breakdown. Cannot assign route.",
      });
    }

    const sameBus = await Assignment.findOne({ bus, date, shift, status: "Assigned" });
    if (sameBus) {
      return res.status(400).json({
        success: false,
        message: "Same bus already assigned for this date and shift",
      });
    }

    const sameDriver = await Assignment.findOne({ driver, date, shift, status: "Assigned" });
    if (sameDriver) {
      return res.status(400).json({
        success: false,
        message: "Same driver already assigned for this date and shift",
      });
    }

    const sameConductor = await Assignment.findOne({ conductor, date, shift, status: "Assigned" });
    if (sameConductor) {
      return res.status(400).json({
        success: false,
        message: "Same conductor already assigned for this date and shift",
      });
    }

    const assignment = await Assignment.create({ bus, route, driver, conductor, date, shift });

    await Driver.findByIdAndUpdate(driver, {
      availability: "Assigned",
      assignedBus: bus,
      assignedRoute: route,
    });

    await Conductor.findByIdAndUpdate(conductor, {
      availability: "Assigned",
      assignedBus: bus,
      shiftTiming: shift,
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
};

exports.getAssignments = async (req, res, next) => {
  try {
    const data = await Assignment.find()
      .populate("bus route driver conductor")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

exports.updateAssignment = async (req, res, next) => {
  try {
    const data = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.deleteAssignment = async (req, res, next) => {
  try {
    const data = await Assignment.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    res.json({ success: true, message: "Assignment deleted" });
  } catch (err) {
    next(err);
  }
};