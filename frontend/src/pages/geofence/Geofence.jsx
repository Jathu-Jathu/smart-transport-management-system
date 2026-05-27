import { useState } from "react";
import api from "../../api/axios";
import { MapPin, ShieldAlert, RefreshCcw } from "lucide-react";

export default function Geofence() {
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const checkGeofence = async () => {
    setMessage("");

    try {
      const res = await api.get("/geofence/check");
      setResults(res.data.data || []);
      setMessage("Geofence check completed");
    } catch (err) {
      setMessage(err.response?.data?.message || "Geofence check failed");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-[#7F1D1D] text-sm tracking-[0.3em] uppercase font-bold">
            Route Safety
          </p>

          <h1 className="text-3xl sm:text-4xl font-black mt-2 text-gray-900">
            GeoFence Alerts
          </h1>

          <p className="text-gray-500 mt-2">
            Check whether buses are moving inside their assigned route boundary.
          </p>
        </div>

        <button
          onClick={checkGeofence}
          className="bg-[#7F1D1D] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#991B1B] flex items-center justify-center gap-2 shadow-sm"
        >
          <RefreshCcw size={18} />
          Check GeoFence
        </button>
      </div>

      {message && (
        <div className="mb-5 bg-red-50 text-[#7F1D1D] border border-red-200 p-4 rounded-xl">
          {message}
        </div>
      )}

      {results.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-gray-500 shadow-sm">
          No geofence results yet. Click check geofence.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {results.map((item) => {
            const outside = item.status === "Outside Geofence";

            return (
              <div
                key={item.trackingId}
                className={`rounded-2xl border p-5 shadow-sm ${
                  outside
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {outside ? (
                        <ShieldAlert className="text-red-700" size={22} />
                      ) : (
                        <MapPin className="text-green-700" size={22} />
                      )}

                      <h3 className="font-black text-lg text-gray-900">
                        {item.busNumber || "Bus"}
                      </h3>
                    </div>

                    <p className="text-gray-600">{item.route}</p>

                    <p className="text-gray-500 text-sm mt-1">
                      Current: {item.currentLocation}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full border font-semibold ${
                      outside
                        ? "text-red-700 border-red-200 bg-white"
                        : "text-green-700 border-green-200 bg-white"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <Info
                    label="Distance from route center"
                    value={`${item.distanceFromRouteCenterKm} km`}
                  />

                  <Info
                    label="Allowed radius"
                    value={`${item.allowedRadiusKm} km`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}