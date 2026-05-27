import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ModulePage from "./pages/ModulePage";
import LiveTrips from "./pages/live/LiveTrips";
import Bookings from "./pages/booking/Bookings";
import Notifications from "./pages/notifications/Notifications";
import AIFeatures from "./pages/ai/AIFeatures";
import Geofence from "./pages/geofence/Geofence";
import Reports from "./pages/reports/Reports";
import DriverDashboard from "./pages/roles/DriverDashboard";
import ConductorDashboard from "./pages/roles/ConductorDashboard";
import PassengerHome from "./pages/passenger/PassengerHome";
import MyTickets from "./pages/passenger/MyTickets";

const protectedRoutes = [
  { path: "buses", title: "Bus Management", endpoint: "/buses" },
  { path: "routes", title: "Route Management", endpoint: "/routes" },
  { path: "drivers", title: "Driver Management", endpoint: "/drivers" },
  { path: "conductors", title: "Conductor Management", endpoint: "/conductors" },
  { path: "schedules", title: "Schedule Management", endpoint: "/schedules" },
  { path: "assignments", title: "Bus Assignments", endpoint: "/assignments" },
  { path: "trip-tracking", title: "Live Trip Monitoring", endpoint: "/trip-tracking" },
  { path: "maintenance", title: "Maintenance Management", endpoint: "/maintenance" },
  { path: "fuel", title: "Fuel Management", endpoint: "/fuel" },
  { path: "attendance", title: "Staff Attendance", endpoint: "/attendance" },
  { path: "incidents", title: "Breakdown / Incident Management", endpoint: "/incidents" },
  { path: "bookings", title: "Ticket Bookings", endpoint: "/bookings" },
  { path: "passengers", title: "Passenger Management", endpoint: "/passengers" },
  { path: "notifications", title: "Notifications", endpoint: "/notifications" },
];

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("rudraToken");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/driver" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
      <Route path="/conductor" element={<ProtectedRoute><ConductorDashboard /></ProtectedRoute>} />
      <Route path="/passenger" element={<ProtectedRoute><PassengerHome /></ProtectedRoute>} />
      <Route path="/my-tickets" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />

      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="ai" element={<AIFeatures />} />
        <Route path="geofence" element={<Geofence />} />
        <Route path="reports" element={<Reports />} />

        {protectedRoutes.map((item) => (
          <Route
            key={item.path}
            path={item.path}
            element={
              item.path === "trip-tracking" ? (
                <LiveTrips />
              ) : item.path === "bookings" ? (
                <Bookings />
              ) : item.path === "notifications" ? (
                <Notifications />
              ) : (
                <ModulePage title={item.title} endpoint={item.endpoint} />
              )
            }
          />
        ))}
      </Route>
    </Routes>
  );
}