import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Search, Ticket, Bus, MapPin, Clock } from "lucide-react";

const seats = [
  "A1","A2","A3","A4",
  "B1","B2","B3","B4",
  "C1","C2","C3","C4",
  "D1","D2","D3","D4",
  "E1","E2","E3","E4",
  "F1","F2","F3","F4",
  "G1","G2","G3","G4",
  "H1","H2","H3","H4",
  "I1","I2","I3","I4",
  "J1","J2","J3","J4",
];

export default function PassengerHome() {
  const [schedules, setSchedules] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [latestTicket, setLatestTicket] = useState(null);

  const [form, setForm] = useState({
    passenger: "",
    schedule: "",
    seatNumber: "",
    paymentStatus: "Paid",
    bookingStatus: "Booked",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [s, p, b] = await Promise.all([
        api.get("/schedules"),
        api.get("/passengers"),
        api.get("/bookings"),
      ]);

      setSchedules(s.data.data || []);
      setPassengers(p.data.data || []);
      setBookings(b.data.data || []);
    } catch {
      setMessage("Failed to load passenger data");
    }
  };

  const bookedSeats = bookings
    .filter(
      (b) =>
        b.schedule?._id === form.schedule &&
        b.bookingStatus !== "Cancelled"
    )
    .map((b) => b.seatNumber);

  const filteredSchedules = schedules.filter((s) => {
    const text =
      `${s.route?.startLocation} ${s.route?.endLocation} ${s.bus?.busName} ${s.bus?.busNumber}`;
    return text.toLowerCase().includes(search.toLowerCase());
  });

  const bookTicket = async (e) => {
    e.preventDefault();
    setMessage("");
    setLatestTicket(null);

    if (!form.seatNumber) {
      setMessage("Please select a seat");
      return;
    }

    try {
      const res = await api.post("/bookings", form);

      setLatestTicket(res.data.data);
      setMessage("Ticket booked successfully");

      setForm({
        passenger: "",
        schedule: "",
        seatNumber: "",
        paymentStatus: "Paid",
        bookingStatus: "Booked",
      });

      loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  const selectSchedule = (id) => {
    setForm({ ...form, schedule: id, seatNumber: "" });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-gray-200 bg-white px-4 sm:px-8 py-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#7F1D1D] tracking-widest">
              RUDRA EXPRESS
            </h1>
            <p className="text-xs text-gray-500 tracking-[0.3em]">
              PREMIUM INTERCITY TRAVEL
            </p>
          </div>

          <a
            href="/my-tickets"
            className="bg-[#7F1D1D] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#991B1B]"
          >
            My Tickets
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        <section className="py-10">
          <p className="text-[#7F1D1D] text-sm tracking-[0.3em] uppercase font-bold">
            Premium Journey
          </p>

          <h2 className="text-4xl sm:text-6xl font-black mt-3 text-gray-900">
            Book Your Luxury Bus
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl">
            Search available routes, choose a schedule and select your seat.
          </p>

          <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 max-w-2xl shadow-sm">
            <Search className="text-[#7F1D1D]" />

            <input
              className="bg-transparent w-full outline-none text-gray-900"
              placeholder="Search Colombo, Kandy, Galle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
          {filteredSchedules.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-gray-500 shadow-sm">
              No schedules found.
            </div>
          ) : (
            filteredSchedules.map((s) => (
              <ScheduleCard
                key={s._id}
                schedule={s}
                onSelect={() => selectSchedule(s._id)}
              />
            ))
          )}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form
            onSubmit={bookTicket}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-2xl font-black mb-5 flex items-center gap-2 text-gray-900">
              <Ticket className="text-[#7F1D1D]" />
              Book Ticket
            </h3>

            {message && (
              <div className="mb-4 bg-red-50 text-[#7F1D1D] border border-red-200 p-3 rounded-xl">
                {message}
              </div>
            )}

            <div className="space-y-4">
              <Select
                label="Passenger"
                value={form.passenger}
                onChange={(v) => setForm({ ...form, passenger: v })}
                options={passengers.map((p) => ({
                  value: p._id,
                  label: `${p.name} - ${p.contact || ""}`,
                }))}
              />

              <Select
                label="Schedule"
                value={form.schedule}
                onChange={(v) =>
                  setForm({ ...form, schedule: v, seatNumber: "" })
                }
                options={schedules.map((s) => ({
                  value: s._id,
                  label: `${s.bus?.busNumber || "Bus"} | ${s.route?.startLocation || ""} → ${s.route?.endLocation || ""}`,
                }))}
              />

              <SeatSelector
                selectedSeat={form.seatNumber}
                bookedSeats={bookedSeats}
                disabled={!form.schedule}
                onSelect={(seat) => setForm({ ...form, seatNumber: seat })}
              />
            </div>

            <button className="mt-5 w-full bg-[#7F1D1D] text-white font-bold py-3 rounded-xl hover:bg-[#991B1B]">
              Confirm Booking
            </button>
          </form>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-2xl font-black mb-5 text-gray-900">
              Latest Ticket
            </h3>

            {!latestTicket ? (
              <p className="text-gray-500">
                Your generated QR ticket will appear here.
              </p>
            ) : (
              <div>
                <p className="text-[#7F1D1D] text-xs tracking-widest font-bold">
                  RUDRA EXPRESS
                </p>

                <h4 className="font-black text-xl mt-1 text-gray-900">
                  {latestTicket.passenger?.name}
                </h4>

                <p className="text-gray-500">
                  Seat: {latestTicket.seatNumber}
                </p>

                {latestTicket.ticketQr && (
                  <img
                    src={latestTicket.ticketQr}
                    alt="QR Ticket"
                    className="w-44 h-44 bg-white border border-gray-200 p-2 rounded-xl my-5"
                  />
                )}

                <p className="text-gray-600 text-sm">
                  Ticket Code:
                  <span className="text-gray-900 font-semibold ml-2">
                    {latestTicket.ticketCode}
                  </span>
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}