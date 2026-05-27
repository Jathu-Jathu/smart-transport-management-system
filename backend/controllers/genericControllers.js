const factory = require("../utils/crudFactory");

const Bus = require("../models/Bus");
const Route = require("../models/Route");
const Driver = require("../models/Driver");
const Conductor = require("../models/Conductor");
const Schedule = require("../models/Schedule");
const Maintenance = require("../models/Maintenance");
const Fuel = require("../models/Fuel");
const Attendance = require("../models/Attendance");
const Incident = require("../models/Incident");
const Passenger = require("../models/Passenger");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");
const TripTracking = require("../models/TripTracking");

exports.bus = {
  getAll: factory.getAll(Bus),
  getOne: factory.getOne(Bus),
  create: factory.createOne(Bus),
  update: factory.updateOne(Bus),
  remove: factory.deleteOne(Bus),
};

exports.route = {
  getAll: factory.getAll(Route),
  getOne: factory.getOne(Route),
  create: factory.createOne(Route),
  update: factory.updateOne(Route),
  remove: factory.deleteOne(Route),
};

exports.driver = {
  getAll: factory.getAll(Driver, "assignedBus assignedRoute"),
  getOne: factory.getOne(Driver, "assignedBus assignedRoute"),
  create: factory.createOne(Driver),
  update: factory.updateOne(Driver),
  remove: factory.deleteOne(Driver),
};

exports.conductor = {
  getAll: factory.getAll(Conductor, "assignedBus"),
  getOne: factory.getOne(Conductor, "assignedBus"),
  create: factory.createOne(Conductor),
  update: factory.updateOne(Conductor),
  remove: factory.deleteOne(Conductor),
};

exports.schedule = {
  getAll: factory.getAll(Schedule, "bus route driver conductor"),
  getOne: factory.getOne(Schedule, "bus route driver conductor"),
  create: factory.createOne(Schedule),
  update: factory.updateOne(Schedule),
  remove: factory.deleteOne(Schedule),
};

exports.maintenance = {
  getAll: factory.getAll(Maintenance, "bus"),
  getOne: factory.getOne(Maintenance, "bus"),
  create: factory.createOne(Maintenance),
  update: factory.updateOne(Maintenance),
  remove: factory.deleteOne(Maintenance),
};

exports.fuel = {
  getAll: factory.getAll(Fuel, "bus"),
  getOne: factory.getOne(Fuel, "bus"),
  create: factory.createOne(Fuel),
  update: factory.updateOne(Fuel),
  remove: factory.deleteOne(Fuel),
};

exports.attendance = {
  getAll: factory.getAll(Attendance, "driver conductor"),
  getOne: factory.getOne(Attendance, "driver conductor"),
  create: factory.createOne(Attendance),
  update: factory.updateOne(Attendance),
  remove: factory.deleteOne(Attendance),
};

exports.incident = {
  getAll: factory.getAll(Incident, "bus"),
  getOne: factory.getOne(Incident, "bus"),
  create: factory.createOne(Incident),
  update: factory.updateOne(Incident),
  remove: factory.deleteOne(Incident),
};

exports.passenger = {
  getAll: factory.getAll(Passenger),
  getOne: factory.getOne(Passenger),
  create: factory.createOne(Passenger),
  update: factory.updateOne(Passenger),
  remove: factory.deleteOne(Passenger),
};

exports.booking = {
  getAll: factory.getAll(Booking, "passenger schedule"),
  getOne: factory.getOne(Booking, "passenger schedule"),
  create: factory.createOne(Booking),
  update: factory.updateOne(Booking),
  remove: factory.deleteOne(Booking),
};

exports.notification = {
  getAll: factory.getAll(Notification),
  getOne: factory.getOne(Notification),
  create: factory.createOne(Notification),
  update: factory.updateOne(Notification),
  remove: factory.deleteOne(Notification),
};

exports.tripTracking = {
  getAll: factory.getAll(TripTracking, "schedule"),
  getOne: factory.getOne(TripTracking, "schedule"),
  create: factory.createOne(TripTracking),
  update: factory.updateOne(TripTracking),
  remove: factory.deleteOne(TripTracking),
};