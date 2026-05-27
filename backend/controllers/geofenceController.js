const TripTracking = require("../models/TripTracking");
const Schedule = require("../models/Schedule");
const Notification = require("../models/Notification");

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

exports.checkGeofence = async (req, res, next) => {
  try {
    const trackings = await TripTracking.find().populate({
      path: "schedule",
      populate: [
        { path: "bus" },
        { path: "route" },
      ],
    });

    const results = [];

    for (const item of trackings) {
      const route = item.schedule?.route;
      const bus = item.schedule?.bus;

      if (
        !route ||
        !route.centerLatitude ||
        !route.centerLongitude ||
        !item.latitude ||
        !item.longitude
      ) {
        continue;
      }

      const distance = calculateDistanceKm(
        Number(route.centerLatitude),
        Number(route.centerLongitude),
        Number(item.latitude),
        Number(item.longitude)
      );

      const allowedRadius = route.allowedRadiusKm || 25;
      const isOutside = distance > allowedRadius;

      if (isOutside) {
        const message = `${bus?.busNumber || "Bus"} may be outside assigned route geofence. Distance: ${distance.toFixed(
          2
        )} km`;

        const exists = await Notification.findOne({
          title: "GeoFence Alert",
          message,
          type: "General",
        });

        if (!exists) {
          await Notification.create({
            title: "GeoFence Alert",
            message,
            type: "General",
          });
        }
      }

      results.push({
        trackingId: item._id,
        busNumber: bus?.busNumber,
        route: `${route.startLocation} → ${route.endLocation}`,
        currentLocation: item.currentLocation,
        distanceFromRouteCenterKm: distance.toFixed(2),
        allowedRadiusKm: allowedRadius,
        status: isOutside ? "Outside Geofence" : "Inside Geofence",
      });
    }

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};