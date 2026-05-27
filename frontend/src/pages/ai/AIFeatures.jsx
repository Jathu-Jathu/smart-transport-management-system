import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Brain, Route, ShieldAlert, UserRoundCheck } from "lucide-react";

export default function AIFeatures() {
  const [maintenance, setMaintenance] = useState([]);
  const [fatigue, setFatigue] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAI();
  }, []);

  const loadAI = async () => {
    try {
      const [m, f, r] = await Promise.all([
        api.get("/ai/predictive-maintenance"),
        api.get("/ai/driver-fatigue"),
        api.get("/ai/route-optimization"),
      ]);

      setMaintenance(m.data.data || []);
      setFatigue(f.data.data || []);
      setRoutes(r.data.data || []);
    } catch {
      setMessage("Failed to load AI insights");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[#7F1D1D] text-sm tracking-[0.3em] uppercase font-bold">
          Smart Intelligence
        </p>

        <h1 className="text-3xl sm:text-4xl font-black mt-2 text-gray-900">
          AI Decision Support
        </h1>

        <p className="text-gray-500 mt-2">
          Rule-based intelligent insights for maintenance, driver fatigue and route optimization.
        </p>
      </div>

      {message && (
        <div className="mb-5 bg-red-50 text-[#7F1D1D] border border-red-200 p-4 rounded-xl">
          {message}
        </div>
      )}

      <Section
        title="Predictive Maintenance"
        icon={ShieldAlert}
        items={maintenance}
        render={(item) => (
          <SmartCard
            title={`${item.busNumber} - ${item.busName}`}
            score={item.riskScore}
            level={item.riskLevel}
            details={item.reasons || []}
          />
        )}
      />

      <Section
        title="Driver Fatigue Detection"
        icon={UserRoundCheck}
        items={fatigue}
        render={(item) => (
          <SmartCard
            title={item.driverName}
            score={item.riskScore}
            level={item.riskLevel}
            details={[
              `Active assignments: ${item.activeAssignments}`,
              ...(item.reasons || []),
            ]}
          />
        )}
      />

      <Section
        title="Route Optimization"
        icon={Route}
        items={routes}
        render={(item) => (
          <SmartCard
            title={item.route}
            score={item.optimizationScore}
            level={item.optimizationScore >= 70 ? "Good" : "Review"}
            details={[
              `Distance: ${item.totalDistanceKm} km`,
              `Time: ${item.estimatedTravelTime}`,
              item.recommendation,
              item.suggestedAction,
            ].filter(Boolean)}
          />
        )}
      />
    </div>
  );
}

function Section({ title, icon: Icon, items, render }) {
  return (
    <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-gray-900">
        <Icon className="text-[#7F1D1D]" size={22} />
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((item, index) => (
            <div key={index}>{render(item)}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function SmartCard({ title, score = 0, level, details = [] }) {
  const color =
    level === "High"
      ? "text-red-700 border-red-200 bg-red-50"
      : level === "Medium" || level === "Review"
      ? "text-yellow-700 border-yellow-200 bg-yellow-50"
      : "text-green-700 border-green-200 bg-green-50";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 h-full shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <Brain className="text-[#7F1D1D] mb-2" size={22} />

          <h3 className="font-black text-lg text-gray-900">{title}</h3>
        </div>

        <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${color}`}>
          {level}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Score</span>
          <span>{score}%</span>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#7F1D1D] rounded-full"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <ul className="space-y-2 text-sm text-gray-600">
        {details.length === 0 ? (
          <li>No major risk factors detected</li>
        ) : (
          details.map((d, i) => <li key={i}>• {d}</li>)
        )}
      </ul>
    </div>
  );
}