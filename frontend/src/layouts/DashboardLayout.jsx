import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Bus,
  UserRound,
  Users,
  CalendarClock,
  Wrench,
  Fuel,
  AlertTriangle,
  Bell,
  Ticket,
  LogOut,
  Route,
  Activity,
  ClipboardCheck,
  Menu,
  X,
  ShieldAlert,
  FileText,
  Brain,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Buses", path: "/buses", icon: Bus },
  { name: "Routes", path: "/routes", icon: Route },
  { name: "Drivers", path: "/drivers", icon: UserRound },
  { name: "Conductors", path: "/conductors", icon: Users },
  { name: "Schedules", path: "/schedules", icon: CalendarClock },
  { name: "Assignments", path: "/assignments", icon: ClipboardCheck },
  { name: "Live Trips", path: "/trip-tracking", icon: Route },
  { name: "GeoFence", path: "/geofence", icon: ShieldAlert },
  { name: "Maintenance", path: "/maintenance", icon: Wrench },
  { name: "Fuel", path: "/fuel", icon: Fuel },
  { name: "Attendance", path: "/attendance", icon: Activity },
  { name: "Incidents", path: "/incidents", icon: AlertTriangle },
  { name: "Bookings", path: "/bookings", icon: Ticket },
  { name: "Passengers", path: "/passengers", icon: Users },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "AI Insights", path: "/ai", icon: Brain },
  { name: "Reports", path: "/reports", icon: FileText },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const logout = () => {
    localStorage.removeItem("rudraToken");
    localStorage.removeItem("rudraUser");
    navigate("/login");
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-widest text-[#7F1D1D]">
            RUDRA EXPRESS
          </h1>
          <p className="text-xs text-gray-500 tracking-[0.3em]">ADMIN</p>
        </div>

        <button
          onClick={() => setOpen(false)}
          className="lg:hidden bg-gray-100 p-2 rounded-xl text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                  isActive
                    ? "bg-[#7F1D1D] text-white font-semibold shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="m-4 w-[calc(100%-2rem)] flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl hover:bg-red-100"
      >
        <LogOut size={18} />
        Logout
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900">
      <aside className="hidden lg:block w-72 border-r border-gray-200 bg-white fixed h-screen overflow-y-auto shadow-sm">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <aside className="relative w-72 max-w-[85vw] h-full bg-white border-r border-gray-200 overflow-y-auto shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="lg:ml-72 min-h-screen">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden bg-gray-100 p-2 rounded-xl text-gray-700"
            >
              <Menu size={22} />
            </button>

            <div>
              <h2 className="text-lg sm:text-2xl font-black tracking-wide text-gray-900">
                Rudra Express Control Center
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block mt-1">
                Premium Intercity Transport Intelligence Platform
              </p>
            </div>
          </div>

          <div className="hidden xl:flex flex-col items-center justify-center px-6">
           
            <h3 className="text-2xl font-black text-gray-700 tabular-nums mt-1">
              {formattedTime}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
          </div>

          <div className="hidden md:flex items-center">
            <img
              src="https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Luxury Bus"
              className="w-32 h-16 object-cover rounded-2xl border border-gray-200 shadow-md"
            />
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}