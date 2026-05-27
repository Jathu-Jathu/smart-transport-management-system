import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Bell, RefreshCcw, CheckCircle, Trash2 } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.data || []);
    } catch {
      setMessage("Failed to load notifications");
    }
  };

  const generateAlerts = async () => {
    setMessage("");

    try {
      const res = await api.post("/alerts/generate");
      setNotifications(res.data.data || []);
      setMessage("Automatic alerts generated successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to generate alerts");
    }
  };

  const markRead = async (item) => {
    await api.put(`/notifications/${item._id}`, { isRead: true });
    loadNotifications();
  };

  const remove = async (id) => {
    await api.delete(`/notifications/${id}`);
    loadNotifications();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-[#7F1D1D] text-sm tracking-[0.3em] uppercase font-bold">
            Alerts
          </p>

          <h1 className="text-3xl sm:text-4xl font-black mt-2 text-gray-900">
            Notifications
          </h1>

          <p className="text-gray-500 mt-2">
            Generate and manage system alerts for maintenance, insurance, license and shifts.
          </p>
        </div>

        <button
          onClick={generateAlerts}
          className="bg-[#7F1D1D] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#991B1B] flex items-center justify-center gap-2 shadow-sm"
        >
          <RefreshCcw size={18} />
          Generate Alerts
        </button>
      </div>

      {message && (
        <div className="mb-5 bg-red-50 text-[#7F1D1D] border border-red-200 p-4 rounded-xl">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {notifications.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-gray-500 shadow-sm">
            No notifications found.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`border rounded-2xl p-5 shadow-sm ${
                n.isRead
                  ? "bg-white border-gray-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-11 h-11 bg-[#7F1D1D] text-white rounded-xl flex items-center justify-center">
                    <Bell size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-[#7F1D1D] tracking-widest uppercase font-bold">
                      {n.type}
                    </p>

                    <h3 className="font-bold text-lg text-gray-900">
                      {n.title}
                    </h3>

                    <p className="text-gray-600 mt-1">{n.message}</p>

                    <p className="text-gray-400 text-xs mt-3">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!n.isRead && (
                    <button
                      onClick={() => markRead(n)}
                      className="bg-green-50 text-green-700 p-2 rounded-lg hover:bg-green-100"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}

                  <button
                    onClick={() => remove(n._id)}
                    className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}