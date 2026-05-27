const Bus = require("../models/Bus");
const Driver = require("../models/Driver");
const Maintenance = require("../models/Maintenance");
const Notification = require("../models/Notification");

const daysBetween = (date) => {
  const today = new Date();
  const target = new Date(date);
  const diff = target - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const createAlert = async (title, message, type) => {
  const exists = await Notification.findOne({ title, message, type });
  if (!exists) {
    await Notification.create({ title, message, type });
  }
};

exports.generateAlerts = async (req, res, next) => {
  try {
    const buses = await Bus.find();
    const drivers = await Driver.find();
    const maintenance = await Maintenance.find().populate("bus");

    for (const bus of buses) {
      if (bus.insuranceExpiry && daysBetween(bus.insuranceExpiry) <= 30) {
        await createAlert(
          "Insurance Expiry Alert",
          `${bus.busNumber} insurance expires within ${daysBetween(bus.insuranceExpiry)} days`,
          "Insurance"
        );
      }

      if (bus.licenseRenewalDate && daysBetween(bus.licenseRenewalDate) <= 30) {
        await createAlert(
          "License Renewal Alert",
          `${bus.busNumber} license renewal is due within ${daysBetween(bus.licenseRenewalDate)} days`,
          "License"
        );
      }

      if (bus.maintenanceStatus === "Under Maintenance") {
        await createAlert(
          "Bus Under Maintenance",
          `${bus.busNumber} is currently under maintenance`,
          "Maintenance"
        );
      }
    }

    for (const driver of drivers) {
      if (driver.licenseExpiry && daysBetween(driver.licenseExpiry) <= 30) {
        await createAlert(
          "Driver License Expiry Alert",
          `${driver.name}'s license expires within ${daysBetween(driver.licenseExpiry)} days`,
          "License"
        );
      }
    }

    for (const item of maintenance) {
      if (item.nextServiceDue && daysBetween(item.nextServiceDue) <= 14) {
        await createAlert(
          "Maintenance Due Alert",
          `${item.bus?.busNumber || "Bus"} next service due within ${daysBetween(
            item.nextServiceDue
          )} days`,
          "Maintenance"
        );
      }
    }

    const alerts = await Notification.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Alerts generated successfully",
      count: alerts.length,
      data: alerts,
    });
  } catch (err) {
    next(err);
  }
};