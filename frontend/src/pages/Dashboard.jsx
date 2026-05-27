import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Bus,
  Route,
  UserRound,
  Wrench,
  Ticket,
  AlertTriangle,
  Users,
} from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Dashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setData(res.data.data || {});
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "Total Buses", value: data.totalBuses, icon: Bus },
    { title: "Active Buses", value: data.activeBuses, icon: Bus },
    { title: "Routes", value: data.totalRoutes, icon: Route },
    { title: "Drivers", value: data.totalDrivers, icon: UserRound },
    { title: "Conductors", value: data.totalConductors, icon: Users },
    { title: "Maintenance", value: data.maintenanceBuses, icon: Wrench },
    { title: "Incidents", value: data.incidents, icon: AlertTriangle },
    { title: "Revenue", value: `Rs. ${data.revenue || 0}`, icon: Ticket },
  ];

  const busStatusChart = {
    labels: ["Active", "Maintenance"],
    datasets: [
      {
        data: [data.activeBuses || 0, data.maintenanceBuses || 0],
        backgroundColor: ["#7F1D1D", "#DC2626"],
        borderColor: ["#7F1D1D", "#DC2626"],
        borderWidth: 1,
      },
    ],
  };

  const costChart = {
    labels: ["Fuel Cost", "Maintenance Cost", "Revenue"],
    datasets: [
      {
        label: "Amount",
        data: [
          data.fuelCosts || 0,
          data.maintenanceCosts || 0,
          data.revenue || 0,
        ],
        backgroundColor: ["#7F1D1D", "#B91C1C", "#111827"],
        borderRadius: 10,
      },
    ],
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-[#7F1D1D] text-sm tracking-[0.3em] uppercase font-bold">
          Control Center
        </p>
        <h1 className="text-4xl font-black mt-2 text-gray-900">
          RUDRA EXPRESS DASHBOARD
        </h1>
        <p className="text-gray-500 mt-2">
          Monitor fleet, routes, drivers, revenue, fuel and maintenance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#7F1D1D]/30 transition"
            >
              <div className="w-11 h-11 bg-[#7F1D1D] text-white rounded-xl flex items-center justify-center mb-4">
                <Icon size={22} />
              </div>

              <p className="text-gray-500 text-sm">{card.title}</p>

              <h2 className="text-2xl font-black mt-1 text-gray-900">
                {card.value || 0}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-1 text-gray-900">
            Bus Status Overview
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Active buses vs maintenance buses.
          </p>

          <div className="max-w-[320px] mx-auto">
            <Doughnut data={busStatusChart} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-1 text-gray-900">
            Financial Overview
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Fuel cost, maintenance cost and booking revenue.
          </p>

          <Bar data={costChart} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            Operations Summary
          </h2>

          <div className="space-y-4">
            <SummaryRow
              label="Completed Trips"
              value={data.tripsCompleted || 0}
            />
            <SummaryRow
              label="Fuel Expenses"
              value={`Rs. ${data.fuelCosts || 0}`}
            />
            <SummaryRow
              label="Maintenance Expenses"
              value={`Rs. ${data.maintenanceCosts || 0}`}
            />
            <SummaryRow
              label="Total Revenue"
              value={`Rs. ${data.revenue || 0}`}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            System Alerts
          </h2>

          <div className="space-y-3">
            <Alert text="Check buses with maintenance status." />
            <Alert text="Review fuel usage reports weekly." />
            <Alert text="Monitor delayed and breakdown trips." />
            <Alert text="Update driver license expiry dates." />
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4">
      <p className="text-gray-600">{label}</p>
      <p className="font-bold text-[#7F1D1D]">{value}</p>
    </div>
  );
}

function Alert({ text }) {
  return (
    <div className="bg-red-50 border border-red-200 text-[#7F1D1D] rounded-xl p-3 text-sm">
      {text}
    </div>
  );
}