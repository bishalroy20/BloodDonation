// src/pages/dashboard/ page for admin too or create AdminHome.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthProvider";

export default function AdminHome() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ donors: 0, funding: 0, requests: 0 });

  useEffect(() => {
    const load = async () => {
      const [d, f, r] = await Promise.all([
        axios.get("http://localhost:5000/api/stats/total-donors"),
        axios.get("http://localhost:5000/api/stats/total-funding"),
        axios.get("http://localhost:5000/api/stats/total-requests"),
      ]);
      setStats({ donors: d.data.total, funding: f.data.total, requests: r.data.total });
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold">Welcome, {profile?.name || "User"} 👋</h2>
        <p className="text-gray-600">Manage your blood donation platform efficiently.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon="🫶" title="Total donors" value={stats.donors} color="bg-red-600" />
        <StatCard icon="💰" title="Total funding" value={`৳ ${stats.funding}`} color="bg-emerald-600" />
        <StatCard icon="🩸" title="Total requests" value={stats.requests} color="bg-indigo-600" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Donors" value={stats.donors} />
        <StatCard title="Total Requests" value={stats.requests} />
        <StatCard title="Total Funding" value={`৳${stats.funding}`} />
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white rounded shadow p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 ${color} text-white rounded flex items-center justify-center text-xl`}>
        {icon}
      </div>
    </div>
  );
}