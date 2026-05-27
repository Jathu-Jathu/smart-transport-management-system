import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { Plus, Trash2, RefreshCcw, Pencil } from "lucide-react";

const fieldMap = {
  "/buses": ["busNumber", "busName", "busType", "totalSeats", "capacity", "registrationNumber", "fuelType", "maintenanceStatus", "insuranceExpiry", "licenseRenewalDate"],
  "/routes": ["routeCode", "startLocation", "endLocation", "stops", "totalDistanceKm", "estimatedTravelTime", "routeStatus", "centerLatitude", "centerLongitude", "allowedRadiusKm"],
  "/drivers": ["name", "licenseNumber", "contact", "experienceYears", "emergencyContact", "availability", "licenseExpiry"],
  "/conductors": ["name", "contact", "emergencyContact", "availability", "shiftTiming"],
  "/schedules": ["bus", "route", "driver", "conductor", "departureTime", "arrivalTime", "pickupTime", "dropTime", "date", "status"],
  "/assignments": ["bus", "route", "driver", "conductor", "date", "shift"],
  "/trip-tracking": ["schedule", "currentLocation", "latitude", "longitude", "routeProgress", "delayMinutes", "eta", "runningStatus"],
  "/maintenance": ["bus", "serviceDate", "oilChange", "tireReplacement", "brakeCheck", "repairIssues", "maintenanceCost", "nextServiceDue", "status"],
  "/fuel": ["bus", "fuelFilledLiters", "amount", "date", "odometerKm", "fuelEfficiency"],
  "/attendance": ["staffType", "driver", "conductor", "date", "status", "shiftTiming"],
  "/incidents": ["bus", "breakdownTime", "location", "issueType", "description", "assignedMechanic", "resolvedStatus"],
  "/bookings": ["passenger", "schedule", "seatNumber", "paymentStatus", "bookingStatus"],
  "/passengers": ["name", "contact", "email"],
  "/notifications": ["title", "message", "type", "isRead"],
};

const selectOptions = {
  busType: ["AC", "Non-AC", "Luxury", "Sleeper"],
  fuelType: ["Diesel", "Petrol", "Hybrid", "Electric"],
  maintenanceStatus: ["Available", "Under Maintenance", "Breakdown"],
  routeStatus: ["Active", "Inactive"],
  availability: ["Available", "Assigned", "On Leave"],
  shift: ["Morning", "Afternoon", "Evening", "Night"],
  runningStatus: ["On Time", "Delayed", "Breakdown"],
  issueType: ["Breakdown", "Accident", "Delay", "Technical Issue", "Other"],
  resolvedStatus: ["Pending", "In Progress", "Resolved"],
  paymentStatus: ["Pending", "Paid", "Failed"],
  bookingStatus: ["Booked", "Cancelled", "Completed"],
  staffType: ["Driver", "Conductor"],
  type: ["Delay", "Maintenance", "License", "Insurance", "Shift", "General"],
  isRead: ["false", "true"],
};

const statusOptionsByEndpoint = {
  "/schedules": ["Scheduled", "Running", "Delayed", "Completed", "Cancelled"],
  "/maintenance": ["Pending", "In Progress", "Completed"],
  "/attendance": ["Present", "Absent", "Leave"],
};

const relationApi = {
  bus: "/buses",
  route: "/routes",
  driver: "/drivers",
  conductor: "/conductors",
  passenger: "/passengers",
  schedule: "/schedules",
};

const numberFields = [
  "totalSeats",
  "capacity",
  "totalDistanceKm",
  "centerLatitude",
  "centerLongitude",
  "allowedRadiusKm",
  "experienceYears",
  "latitude",
  "longitude",
  "routeProgress",
  "delayMinutes",
  "maintenanceCost",
  "fuelFilledLiters",
  "amount",
  "odometerKm",
  "fuelEfficiency",
];

export default function ModulePage({ title, endpoint }) {
  const fields = fieldMap[endpoint] || [];
  const [records, setRecords] = useState([]);
  const [relations, setRelations] = useState({});
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const loadData = async () => {
    try {
      const res = await api.get(endpoint);
      setRecords(res.data.data || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load data");
    }
  };

  const loadRelations = async () => {
    const needed = fields.filter((f) => relationApi[f]);
    const temp = {};

    for (const field of needed) {
      try {
        const res = await api.get(relationApi[field]);
        temp[field] = res.data.data || [];
      } catch {
        temp[field] = [];
      }
    }

    setRelations(temp);
  };

  useEffect(() => {
    setForm({});
    setEditId(null);
    setMessage("");
    setSearch("");
    setFilter("");
    setPage(1);
    loadData();
    loadRelations();
  }, [endpoint]);

  const cleanPayload = () => {
    const payload = { ...form };

    if (payload.stops && typeof payload.stops === "string") {
      payload.stops = payload.stops
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    Object.keys(payload).forEach((key) => {
      if (payload[key] === "") delete payload[key];
      else if (payload[key] === "true") payload[key] = true;
      else if (payload[key] === "false") payload[key] = false;
      else if (numberFields.includes(key)) payload[key] = Number(payload[key]);
    });

    return payload;
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload = cleanPayload();

      if (editId) {
        await api.put(`${endpoint}/${editId}`, payload);
        setMessage("Updated successfully");
      } else {
        await api.post(endpoint, payload);
        setMessage("Created successfully");
      }

      setForm({});
      setEditId(null);
      loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Save failed");
    }
  };

  const startEdit = (item) => {
    const temp = {};

    fields.forEach((field) => {
      const value = item[field];

      if (Array.isArray(value)) temp[field] = value.join(", ");
      else if (typeof value === "object" && value?._id) temp[field] = value._id;
      else if (typeof value === "string" && value.includes("T") && field.toLowerCase().includes("date")) {
        temp[field] = value.split("T")[0];
      } else {
        temp[field] = value ?? "";
      }
    });

    setForm(temp);
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`);
      loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete failed");
    }
  };

  const tableKeys = useMemo(() => {
    if (!records[0]) return fields.slice(0, 6);
    return Object.keys(records[0]).filter((k) => !["_id", "__v"].includes(k)).slice(0, 7);
  }, [records, fields]);

  const displayName = (field, item) => {
    if (field === "bus") return `${item.busNumber || ""} ${item.busName || ""}`;
    if (field === "route") return `${item.routeCode || ""} ${item.startLocation || ""} → ${item.endLocation || ""}`;
    if (field === "schedule") {
      return `${item.bus?.busNumber || "Bus"} | ${item.route?.startLocation || ""} → ${item.route?.endLocation || ""} | ${item.departureTime || ""}`;
    }
    return item.name || item.email || item._id;
  };

  const renderValue = (value) => {
    if (value === null || value === undefined) return "-";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") {
      if (value.startLocation && value.endLocation) return `${value.startLocation} → ${value.endLocation}`;
      return value.busName || value.busNumber || value.name || value.routeCode || value.seatNumber || value.title || value._id || "-";
    }
    if (typeof value === "string" && value.includes("T")) return value.split("T")[0];
    return String(value);
  };

  const getOptions = (field) => {
    if (field === "status" && statusOptionsByEndpoint[endpoint]) {
      return statusOptionsByEndpoint[endpoint];
    }
    return selectOptions[field];
  };

  const getInputType = (field) => {
    if (numberFields.includes(field)) return "number";
    if (field === "email") return "email";
    if (field.toLowerCase().includes("date") || field.toLowerCase().includes("expiry")) return "date";
    if (field.toLowerCase().includes("time")) return "time";
    return "text";
  };

  const searchableRecords = records.filter((item) => {
    const text = JSON.stringify(item).toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());

    if (!filter) return matchesSearch;

    const itemStatus =
      item.status ||
      item.maintenanceStatus ||
      item.routeStatus ||
      item.availability ||
      item.runningStatus ||
      item.paymentStatus ||
      item.bookingStatus ||
      item.resolvedStatus ||
      item.type;

    return matchesSearch && itemStatus === filter;
  });

  const totalPages = Math.ceil(searchableRecords.length / pageSize) || 1;

  const paginatedRecords = searchableRecords.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const availableFilters = [
    ...new Set(
      records
        .map(
          (item) =>
            item.status ||
            item.maintenanceStatus ||
            item.routeStatus ||
            item.availability ||
            item.runningStatus ||
            item.paymentStatus ||
            item.bookingStatus ||
            item.resolvedStatus ||
            item.type
        )
        .filter(Boolean)
    ),
  ];

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">{title}</h1>
          <p className="text-gray-500">Create, update, view and manage records.</p>
        </div>

        <button
          onClick={() => {
            loadData();
            loadRelations();
          }}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 shadow-sm"
        >
          <RefreshCcw size={17} />
          Refresh
        </button>
      </div>

      {message && (
        <div className="mb-5 bg-red-50 text-[#7F1D1D] border border-red-200 p-4 rounded-xl">
          {message}
        </div>
      )}

      <form onSubmit={submit} className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Plus size={20} className="text-[#7F1D1D]" />
          {editId ? "Update Record" : "Add New"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fields.map((field) => (
            <div key={field}>
              <label className="text-xs text-gray-500 capitalize">{field}</label>

              {relationApi[field] ? (
                <select
                  className="w-full mt-2 bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:border-[#7F1D1D]"
                  value={form[field] || ""}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                >
                  <option value="">Select {field}</option>
                  {(relations[field] || []).map((item) => (
                    <option className="bg-white text-black" key={item._id} value={item._id}>
                      {displayName(field, item)}
                    </option>
                  ))}
                </select>
              ) : getOptions(field) ? (
                <select
                  className="w-full mt-2 bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:border-[#7F1D1D]"
                  value={form[field] || ""}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                >
                  <option value="">Select</option>
                  {getOptions(field).map((op) => (
                    <option className="bg-white text-black" key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={getInputType(field)}
                  placeholder={field === "stops" ? "Kadawatha, Kegalle, Peradeniya" : field}
                  className="w-full mt-2 bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:border-[#7F1D1D]"
                  value={form[field] || ""}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-5">
          <button className="bg-[#7F1D1D] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#991B1B] shadow-sm">
            {editId ? "Update Record" : "Save Record"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm({});
              }}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:border-[#7F1D1D]"
          placeholder="Search records..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:border-[#7F1D1D]"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Status / Types</option>
          {availableFilters.map((f) => (
            <option className="bg-white text-black" key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setFilter("");
            setPage(1);
          }}
          className="bg-gray-100 text-gray-700 rounded-xl px-4 py-3 hover:bg-gray-200"
        >
          Clear Filters
        </button>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {tableKeys.map((key) => (
                <th key={key} className="text-left p-4 capitalize font-semibold">
                  {key}
                </th>
              ))}
              <th className="text-left p-4 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedRecords.length === 0 ? (
              <tr>
                <td className="p-5 text-gray-500" colSpan={tableKeys.length + 1}>
                  No records found.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((item) => (
                <tr key={item._id} className="border-t border-gray-200 hover:bg-gray-50">
                  {tableKeys.map((key) => (
                    <td key={key} className="p-4 text-gray-800">
                      {renderValue(item[key])}
                    </td>
                  ))}
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="bg-[#7F1D1D]/10 text-[#7F1D1D] p-2 rounded-lg hover:bg-[#7F1D1D]/20"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => remove(item._id)}
                      className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5">
        <p className="text-gray-500 text-sm">
          Showing {paginatedRecords.length} of {searchableRecords.length} records
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="bg-white border border-gray-200 text-gray-700 disabled:opacity-40 px-4 py-2 rounded-xl"
          >
            Prev
          </button>

          <span className="text-gray-500 text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="bg-white border border-gray-200 text-gray-700 disabled:opacity-40 px-4 py-2 rounded-xl"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}