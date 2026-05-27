import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../../api/axios";
import { MapPin, Radio, Send, Bus, Clock } from "lucide-react";

const socket = io(import.meta.env.VITE_SOCKET_URL);

export default function LiveTrips() {
  const [trackings, setTrackings] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [form, setForm] = useState({
    schedule: "",
    currentLocation: "",
    latitude: "",
    longitude: "",
    routeProgress: "",
    delayMinutes: "",
    eta: "",
    runningStatus: "On Time",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();

    socket.on("liveTripUpdate", (data) => {
      setLiveUpdates((prev) => [data, ...prev].slice(0, 10));
    });

    return () => {
      socket.off("liveTripUpdate");
    };
  }, []);

  const loadData = async () => {
    try {
      const trackingRes = await api.get("/trip-tracking");
      const scheduleRes = await api.get("/schedules");

      setTrackings(trackingRes.data.data || []);
      setSchedules(scheduleRes.data.data || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load live trips");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload = {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        routeProgress: Number(form.routeProgress),
        delayMinutes: Number(form.delayMinutes),
      };

      await api.post("/trip-tracking", payload);

      socket.emit("tripLocationUpdate", {
        ...payload,
        updatedAt: new Date().toLocaleTimeString(),
      });

      setMessage("Live trip updated successfully");

      setForm({
        schedule: "",
        currentLocation: "",
        latitude: "",
        longitude: "",
        routeProgress: "",
        delayMinutes: "",
        eta: "",
        runningStatus: "On Time",
      });

      loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update trip");
    }
  };

  const getScheduleLabel = (schedule) => {
    if (!schedule) return "Unknown Schedule";

    const route = schedule.route;
    const bus = schedule.bus;

    return `${bus?.busNumber || "Bus"} | ${route?.startLocation || ""} → ${
      route?.endLocation || ""
    } | ${schedule.departureTime || ""}`;
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[#7F1D1D] text-sm tracking-[0.3em] uppercase font-bold">
          Real Time
        </p>

        <h1 className="text-3xl sm:text-4xl font-black mt-2 text-gray-900">
          Live Trip Monitoring
        </h1>

        <p className="text-gray-500 mt-2">
          Track current location, route progress, delays and running status.
        </p>
      </div>

      {message && (
        <div className="mb-5 bg-red-50 text-[#7F1D1D] border border-red-200 p-4 rounded-xl">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form
          onSubmit={submit}
          className="xl:col-span-1 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
        >
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-gray-900">
            <Radio className="text-[#7F1D1D]" size={20} />
            Send Live Update
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500">Schedule</label>

              <select
                className="w-full mt-2 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                value={form.schedule}
                onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                required
              >
                <option value="">Select schedule</option>

                {schedules.map((s) => (
                  <option className="bg-white text-black" key={s._id} value={s._id}>
                    {getScheduleLabel(s)}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Current Location"
              value={form.currentLocation}
              onChange={(v) => setForm({ ...form, currentLocation: v })}
              placeholder="Kadawatha"
            />

            <Input
              label="Latitude"
              value={form.latitude}
              onChange={(v) => setForm({ ...form, latitude: v })}
              placeholder="7.0012"
            />

            <Input
              label="Longitude"
              value={form.longitude}
              onChange={(v) => setForm({ ...form, longitude: v })}
              placeholder="79.9500"
            />

            <Input
              label="Route Progress %"
              value={form.routeProgress}
              onChange={(v) => setForm({ ...form, routeProgress: v })}
              placeholder="45"
            />

            <Input
              label="Delay Minutes"
              value={form.delayMinutes}
              onChange={(v) => setForm({ ...form, delayMinutes: v })}
              placeholder="10"
            />

            <Input
              label="ETA"
              value={form.eta}
              onChange={(v) => setForm({ ...form, eta: v })}
              placeholder="10:30 AM"
            />

            <div>
              <label className="text-xs text-gray-500">Running Status</label>

              <select
                className="w-full mt-2 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                value={form.runningStatus}
                onChange={(e) =>
                  setForm({ ...form, runningStatus: e.target.value })
                }
              >
                <option className="bg-white text-black">On Time</option>
                <option className="bg-white text-black">Delayed</option>
                <option className="bg-white text-black">Breakdown</option>
              </select>
            </div>
          </div>

          <button className="mt-5 w-full bg-[#7F1D1D] text-white font-bold py-3 rounded-xl hover:bg-[#991B1B] flex items-center justify-center gap-2 shadow-sm">
            <Send size={18} />
            Update Live Trip
          </button>
        </form>

        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-gray-900">
              <Bus className="text-[#7F1D1D]" size={20} />
              Current Trip Records
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trackings.length === 0 ? (
                <p className="text-gray-500">No trip tracking records yet.</p>
              ) : (
                trackings.map((item) => (
                  <TripCard key={item._id} item={item} />
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-gray-900">
              <Clock className="text-[#7F1D1D]" size={20} />
              Realtime Socket Updates
            </h2>

            <div className="space-y-3">
              {liveUpdates.length === 0 ? (
                <p className="text-gray-500">No realtime updates received yet.</p>
              ) : (
                liveUpdates.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                  >
                    <p className="font-bold text-gray-900">
                      {item.currentLocation}
                    </p>

                    <p className="text-gray-500 text-sm">
                      {item.runningStatus} • Delay {item.delayMinutes} mins • ETA{" "}
                      {item.eta}
                    </p>

                    <p className="text-[#7F1D1D] text-xs mt-1 font-semibold">
                      Updated at {item.updatedAt}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>

      <input
        className="w-full mt-2 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TripCard({ item }) {
  const statusStyle =
    item.runningStatus === "On Time"
      ? "text-green-700 bg-green-50 border-green-200"
      : item.runningStatus === "Delayed"
      ? "text-yellow-700 bg-yellow-50 border-yellow-200"
      : "text-red-700 bg-red-50 border-red-200";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-gray-500 text-sm">Current Location</p>

          <h3 className="font-black text-lg flex items-center gap-2 text-gray-900">
            <MapPin size={18} className="text-[#7F1D1D]" />
            {item.currentLocation || "Unknown"}
          </h3>
        </div>

        <span className={`text-xs px-3 py-1 rounded-full border ${statusStyle}`}>
          {item.runningStatus}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Route Progress</span>
          <span>{item.routeProgress || 0}%</span>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#7F1D1D] rounded-full"
            style={{ width: `${item.routeProgress || 0}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Info label="Delay" value={`${item.delayMinutes || 0} mins`} />
        <Info label="ETA" value={item.eta || "-"} />
        <Info label="Latitude" value={item.latitude || "-"} />
        <Info label="Longitude" value={item.longitude || "-"} />
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}