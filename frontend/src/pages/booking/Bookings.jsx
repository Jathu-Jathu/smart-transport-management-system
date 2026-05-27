import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Ticket, Trash2 } from "lucide-react";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({
    passenger: "",
    schedule: "",
    seatNumber: "",
    paymentStatus: "Paid",
    bookingStatus: "Booked",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [b, p, s] = await Promise.all([
        api.get("/bookings"),
        api.get("/passengers"),
        api.get("/schedules"),
      ]);

      setBookings(b.data.data || []);
      setPassengers(p.data.data || []);
      setSchedules(s.data.data || []);
    } catch (err) {
      setMessage("Failed to load bookings");
    }
  };

  const createBooking = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/bookings", form);

      setMessage("Ticket booking created with QR code");

      setForm({
        passenger: "",
        schedule: "",
        seatNumber: "",
        paymentStatus: "Paid",
        bookingStatus: "Booked",
      });

      loadAll();
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      loadAll();
    } catch {
      setMessage("Delete failed");
    }
  };

  const scheduleLabel = (s) => {
    return `${s.bus?.busNumber || "Bus"} | ${s.route?.startLocation || ""} → ${
      s.route?.endLocation || ""
    } | ${s.departureTime || ""}`;
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[#7F1D1D] text-sm tracking-[0.3em] uppercase font-bold">
          Ticketing
        </p>

        <h1 className="text-3xl sm:text-4xl font-black mt-2 text-gray-900">
          QR Ticket Bookings
        </h1>

        <p className="text-gray-500 mt-2">
          Create passenger bookings and generate QR tickets automatically.
        </p>
      </div>

      {message && (
        <div className="mb-5 bg-red-50 text-[#7F1D1D] border border-red-200 p-4 rounded-xl">
          {message}
        </div>
      )}

      <form
        onSubmit={createBooking}
        className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 shadow-sm"
      >
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-gray-900">
          <Ticket className="text-[#7F1D1D]" size={20} />
          Create Ticket
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Passenger"
            value={form.passenger}
            onChange={(v) => setForm({ ...form, passenger: v })}
            options={passengers.map((p) => ({
              value: p._id,
              label: p.name,
            }))}
          />

          <Select
            label="Schedule"
            value={form.schedule}
            onChange={(v) => setForm({ ...form, schedule: v })}
            options={schedules.map((s) => ({
              value: s._id,
              label: scheduleLabel(s),
            }))}
          />

          <Input
            label="Seat Number"
            value={form.seatNumber}
            onChange={(v) => setForm({ ...form, seatNumber: v })}
            placeholder="A1"
          />

          <Select
            label="Payment Status"
            value={form.paymentStatus}
            onChange={(v) => setForm({ ...form, paymentStatus: v })}
            options={["Pending", "Paid", "Failed"].map((x) => ({
              value: x,
              label: x,
            }))}
          />

          <Select
            label="Booking Status"
            value={form.bookingStatus}
            onChange={(v) => setForm({ ...form, bookingStatus: v })}
            options={["Booked", "Cancelled", "Completed"].map((x) => ({
              value: x,
              label: x,
            }))}
          />
        </div>

        <button className="mt-5 bg-[#7F1D1D] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#991B1B] shadow-sm">
          Generate QR Ticket
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {bookings.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-500">No bookings found.</p>
          </div>
        ) : (
          bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between gap-3 mb-4">
                <div>
                  <p className="text-[#7F1D1D] text-xs tracking-widest font-bold">
                    RUDRA EXPRESS
                  </p>

                  <h3 className="font-black text-lg text-gray-900">
                    {b.passenger?.name || "Passenger"}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    Seat: {b.seatNumber}
                  </p>
                </div>

                <button
                  onClick={() => remove(b._id)}
                  className="bg-red-50 text-red-600 p-2 rounded-lg h-fit hover:bg-red-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {b.ticketQr && (
                <img
                  src={b.ticketQr}
                  alt="Ticket QR"
                  className="w-40 h-40 bg-white border border-gray-200 p-2 rounded-xl mb-4"
                />
              )}

              <div className="space-y-2 text-sm">
                <p className="text-gray-500">
                  Ticket Code:{" "}
                  <span className="text-gray-900 font-semibold">
                    {b.ticketCode}
                  </span>
                </p>

                <p className="text-gray-500">
                  Payment:{" "}
                  <span className="text-green-700 font-semibold">
                    {b.paymentStatus}
                  </span>
                </p>

                <p className="text-gray-500">
                  Status:{" "}
                  <span className="text-[#7F1D1D] font-semibold">
                    {b.bookingStatus}
                  </span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>

      <input
        required
        className="w-full mt-2 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>

      <select
        required
        className="w-full mt-2 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select {label}</option>

        {options.map((op) => (
          <option className="bg-white text-black" key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </div>
  );
}