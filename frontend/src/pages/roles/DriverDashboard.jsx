import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Bus, MapPin, Clock, AlertTriangle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("rudraUser") || "{}");

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const res = await api.get("/assignments");
      const all = res.data.data || [];

      const myAssignments = all.filter(
        (a) =>
          a.driver?.name?.toLowerCase() === user.name?.toLowerCase() ||
          a.driver?.contact === user.phone
      );

      setAssignments(myAssignments);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load trips");
    }
  };

  const logout = () => {
    localStorage.removeItem("rudraToken");
    localStorage.removeItem("rudraUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-[#7F1D1D] text-sm tracking-[0.3em] uppercase font-bold">
              Driver Portal
            </p>

            <h1 className="text-3xl sm:text-4xl font-black mt-2 text-gray-900">
              Welcome, {user.name}
            </h1>

            <p className="text-gray-500 mt-2">
              View assigned buses, routes and shifts.
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl hover:bg-red-100"
          >
            <LogOut size={18} />
          </button>
        </div>

        {message && (
          <div className="mb-5 bg-red-50 text-[#7F1D1D] border border-red-200 p-4 rounded-xl">
            {message}
          </div>
        )}

        {assignments.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-gray-500 shadow-sm">
            No assigned trips found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {assignments.map((a) => (
              <div
                key={a._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#7F1D1D] text-white rounded-xl flex items-center justify-center">
                    <Bus size={24} />
                  </div>

                  <div>
                    <h2 className="font-black text-xl text-gray-900">
                      {a.bus?.busNumber} - {a.bus?.busName}
                    </h2>

                    <p className="text-gray-500">{a.shift} Shift</p>
                  </div>
                </div>

                <Info
                  icon={MapPin}
                  label="Route"
                  value={`${a.route?.startLocation || "-"} → ${
                    a.route?.endLocation || "-"
                  }`}
                />

                <Info
                  icon={Clock}
                  label="Date"
                  value={a.date ? new Date(a.date).toLocaleDateString() : "-"}
                />

                <Info icon={AlertTriangle} label="Status" value={a.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
      <p className="text-gray-500 text-xs flex items-center gap-2">
        <Icon size={15} className="text-[#7F1D1D]" />
        {label}
      </p>

      <p className="font-semibold mt-1 text-gray-900">{value || "-"}</p>
    </div>
  );
}