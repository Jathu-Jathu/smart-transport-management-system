import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Ticket, Search } from "lucide-react";

export default function MyTickets() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/bookings").then((res) => setBookings(res.data.data || []));
  }, []);

  const filtered = bookings.filter((b) => {
    const text = `${b.ticketCode} ${b.passenger?.name} ${b.seatNumber}`;
    return text.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-gray-200 bg-white px-4 sm:px-8 py-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#7F1D1D] tracking-widest">
              RUDRA EXPRESS
            </h1>
            <p className="text-xs text-gray-500 tracking-[0.3em]">
              MY TICKETS
            </p>
          </div>

          <a
            href="/passenger"
            className="bg-[#7F1D1D] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#991B1B]"
          >
            Book Ticket
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        <div className="mb-8">
          <p className="text-[#7F1D1D] text-sm tracking-[0.3em] uppercase font-bold">
            Ticket History
          </p>

          <h2 className="text-4xl font-black mt-2 text-gray-900">
            Find Your Ticket
          </h2>

          <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 max-w-xl shadow-sm">
            <Search className="text-[#7F1D1D]" />

            <input
              className="bg-transparent w-full outline-none text-gray-900"
              placeholder="Search by ticket code, name, seat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.length === 0 ? (
            <div className="col-span-full bg-white border border-gray-200 rounded-2xl p-6 text-gray-500 shadow-sm">
              No tickets found.
            </div>
          ) : (
            filtered.map((b) => (
              <div
                key={b._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-[#7F1D1D] text-white rounded-xl flex items-center justify-center">
                    <Ticket />
                  </div>

                  <div>
                    <p className="text-[#7F1D1D] text-xs tracking-widest font-bold">
                      RUDRA EXPRESS
                    </p>

                    <h3 className="font-black text-lg text-gray-900">
                      {b.passenger?.name || "Passenger"}
                    </h3>
                  </div>
                </div>

                {b.ticketQr && (
                  <img
                    src={b.ticketQr}
                    alt="QR Ticket"
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
                    Seat:{" "}
                    <span className="text-gray-900 font-semibold">
                      {b.seatNumber}
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
      </main>
    </div>
  );
}