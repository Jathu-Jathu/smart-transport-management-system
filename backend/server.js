const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "RUDRA EXPRESS API running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/alerts", require("./routes/alertRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/geofence", require("./routes/geofenceRoutes"));
app.use("/api/assignments", require("./routes/assignmentRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));

const {
  busRoutes,
  routeRoutes,
  driverRoutes,
  conductorRoutes,
  scheduleRoutes,
  maintenanceRoutes,
  fuelRoutes,
  attendanceRoutes,
  incidentRoutes,
  passengerRoutes,
  notificationRoutes,
  tripTrackingRoutes,
} = require("./routes/mainRoutes");

app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/conductors", conductorRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/fuel", fuelRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/passengers", passengerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/trip-tracking", tripTrackingRoutes);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("tripLocationUpdate", (data) => {
    io.emit("liveTripUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`RUDRA EXPRESS server running on port ${PORT}`);
});