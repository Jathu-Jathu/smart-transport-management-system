import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Bus, Lock, Mail } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "admin@rudra.com",
    password: "123456",
  });

  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("rudraToken", res.data.token);
      localStorage.setItem("rudraUser", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      if (role === "driver") navigate("/driver");
      else if (role === "conductor") navigate("/conductor");
      else if (role === "passenger") navigate("/passenger");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#7F1D1D18,transparent_35%),radial-gradient(circle_at_bottom_right,#11182712,transparent_30%)]" />

      <div className="relative w-full max-w-5xl bg-white border border-gray-200 rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between bg-[#7F1D1D] p-10 text-white">
          <div>
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-8">
              <Bus size={30} />
            </div>

            <h1 className="text-5xl font-black tracking-widest">RUDRA</h1>
            <p className="text-white/90 tracking-[0.35em] text-4xl mt-2 font-semibold">
              EXPRESS
            </p>

            <p className="text-white/75 mt-8 leading-relaxed max-w-sm">
              Premium fleet operations, route scheduling, driver assignment and
              luxury coach management in one control center.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden border border-white/15 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Luxury Bus"
              className="w-full h-52 object-cover"
            />
          </div>
        </div>

        <form onSubmit={login} className="p-8 sm:p-12">
          <div className="mb-10">
            <p className="text-[#7F1D1D] text-sm tracking-[0.3em] font-bold uppercase">
              Welcome Back
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Sign in to Control Center
            </h2>
            <p className="text-gray-500 mt-3">
              Access your RUDRA EXPRESS fleet management dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          <label className="text-sm text-gray-600 font-medium">Email</label>
          <div className="mt-2 mb-5 flex items-center gap-3 bg-white border border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#7F1D1D]">
            <Mail size={18} className="text-gray-400" />
            <input
              type="email"
              className="w-full outline-none text-gray-900"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <label className="text-sm text-gray-600 font-medium">Password</label>
          <div className="mt-2 mb-7 flex items-center gap-3 bg-white border border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#7F1D1D]">
            <Lock size={18} className="text-gray-400" />
            <input
              type="password"
              className="w-full outline-none text-gray-900"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button className="w-full bg-[#7F1D1D] text-white font-bold py-3 rounded-xl hover:bg-[#991B1B] shadow-md">
            Login
          </button>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 italic">
              Driven by Precision. Powered by Intelligence.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}