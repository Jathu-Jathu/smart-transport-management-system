const Bus = require("../models/Bus");
const Driver = require("../models/Driver");
const Conductor = require("../models/Conductor");
const Route = require("../models/Route");
const Schedule = require("../models/Schedule");
const Maintenance = require("../models/Maintenance");
const Fuel = require("../models/Fuel");
const Booking = require("../models/Booking");
const Incident = require("../models/Incident");

exports.getDashboard = async (req, res, next) => {
  try {
    const [
      totalBuses,
      activeBuses,
      maintenanceBuses,
      totalDrivers,
      totalConductors,
      totalRoutes,
      tripsCompleted,
      incidents,
      bookings,
      fuelRecords,
      maintenanceRecords,
    ] = await Promise.all([
      Bus.countDocuments(),
      Bus.countDocuments({ maintenanceStatus: "Available" }),
      Bus.countDocuments({ maintenanceStatus: "Under Maintenance" }),
      Driver.countDocuments(),
      Conductor.countDocuments(),
      Route.countDocuments(),
      Schedule.countDocuments({ status: "Completed" }),
      Incident.countDocuments(),
      Booking.find({ paymentStatus: "Paid" }),
      Fuel.find(),
      Maintenance.find(),
    ]);

    const revenue = bookings.length * 2500;
    const fuelCosts = fuelRecords.reduce((sum, item) => sum + item.amount, 0);
    const maintenanceCosts = maintenanceRecords.reduce((sum, item) => sum + item.maintenanceCost, 0);

    res.json({
      success: true,
      data: {
        totalBuses,
        activeBuses,
        maintenanceBuses,
        totalDrivers,
        totalConductors,
        totalRoutes,
        tripsCompleted,
        incidents,
        revenue,
        fuelCosts,
        maintenanceCosts,
      },
    });
  } catch (err) {
    next(err);
  }
};

