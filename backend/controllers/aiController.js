const Bus = require("../models/Bus");
const Driver = require("../models/Driver");
const Route = require("../models/Route");
const Assignment = require("../models/Assignment");
const Maintenance = require("../models/Maintenance");
const Incident = require("../models/Incident");

const daysBetween = (date) => {
  if (!date) return null;
  const today = new Date();
  const target = new Date(date);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

// 1. Predictive Maintenance
exports.predictiveMaintenance = async (req, res, next) => {
  try {
    const buses = await Bus.find();
    const results = [];

    for (const bus of buses) {
      const maintenance = await Maintenance.find({ bus: bus._id }).sort({ serviceDate: -1 });
      const incidents = await Incident.countDocuments({ bus: bus._id });

      let riskScore = 20;
      let reasons = [];

      if (bus.maintenanceStatus === "Under Maintenance") {
        riskScore += 35;
        reasons.push("Bus is currently under maintenance");
      }

      if (bus.maintenanceStatus === "Breakdown") {
        riskScore += 50;
        reasons.push("Bus has breakdown status");
      }

      if (incidents >= 2) {
        riskScore += 20;
        reasons.push("Multiple incidents reported");
      }

      if (maintenance[0]?.nextServiceDue) {
        const dueDays = daysBetween(maintenance[0].nextServiceDue);

        if (dueDays <= 0) {
          riskScore += 30;
          reasons.push("Service is overdue");
        } else if (dueDays <= 14) {
          riskScore += 15;
          reasons.push("Service due soon");
        }
      }

      riskScore = Math.min(riskScore, 100);

      results.push({
        busId: bus._id,
        busNumber: bus.busNumber,
        busName: bus.busName,
        riskScore,
        riskLevel: riskScore >= 70 ? "High" : riskScore >= 40 ? "Medium" : "Low",
        reasons,
      });
    }

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

// 2. Driver Fatigue Detection
exports.driverFatigue = async (req, res, next) => {
  try {
    const drivers = await Driver.find();
    const results = [];

    for (const driver of drivers) {
      const assignments = await Assignment.find({
        driver: driver._id,
        status: "Assigned",
      });

      let riskScore = assignments.length * 15;
      let reasons = [];

      if (assignments.length >= 4) {
        riskScore += 25;
        reasons.push("Driver has many active assignments");
      }

      if (driver.availability === "Assigned") {
        riskScore += 10;
        reasons.push("Driver is currently assigned");
      }

      riskScore = Math.min(riskScore, 100);

      results.push({
        driverId: driver._id,
        driverName: driver.name,
        activeAssignments: assignments.length,
        riskScore,
        riskLevel: riskScore >= 70 ? "High" : riskScore >= 40 ? "Medium" : "Low",
        reasons,
      });
    }

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

// 3. Route Optimization
exports.routeOptimization = async (req, res, next) => {
  try {
    const routes = await Route.find({ routeStatus: "Active" });

    const suggestions = routes.map((route) => {
      let score = 100;

      if (route.totalDistanceKm > 200) score -= 20;
      if (route.totalDistanceKm > 300) score -= 20;

      const recommended = score >= 70;

      return {
        routeId: route._id,
        routeCode: route.routeCode,
        route: `${route.startLocation} → ${route.endLocation}`,
        totalDistanceKm: route.totalDistanceKm,
        estimatedTravelTime: route.estimatedTravelTime,
        optimizationScore: score,
        recommendation: recommended
          ? "Recommended route for luxury service"
          : "Review route timing, distance and stops before assigning",
        suggestedAction: recommended
          ? "Assign premium coach"
          : "Reduce stops or adjust schedule",
      };
    });

    res.json({ success: true, data: suggestions });
  } catch (err) {
    next(err);
  }
};