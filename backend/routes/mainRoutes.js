const createCrudRoute = require("./createCrudRoute");
const c = require("../controllers/genericControllers");

module.exports = {
  busRoutes: createCrudRoute(c.bus),
  routeRoutes: createCrudRoute(c.route),
  driverRoutes: createCrudRoute(c.driver),
  conductorRoutes: createCrudRoute(c.conductor),
  scheduleRoutes: createCrudRoute(c.schedule),
  maintenanceRoutes: createCrudRoute(c.maintenance),
  fuelRoutes: createCrudRoute(c.fuel),
  attendanceRoutes: createCrudRoute(c.attendance),
  incidentRoutes: createCrudRoute(c.incident),
  passengerRoutes: createCrudRoute(c.passenger),
  bookingRoutes: createCrudRoute(c.booking),
  notificationRoutes: createCrudRoute(c.notification),
  tripTrackingRoutes: createCrudRoute(c.tripTracking),
};