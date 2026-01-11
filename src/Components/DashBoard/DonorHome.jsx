// src/pages/dashboard/DonorHome.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthProvider";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminHome from "./AdminHome";

export default function DonorHome() {
  const { user } = useAuth();
  const [recent, setRecent] = useState([]);
  const [profile, setProfile] = useState(null);

  // const { profile } = useAuth();
  const [stats, setStats] = useState({ donors: 0, funding: 0, requests: 0 });

  useEffect(() => {
    const load = async () => {
      const [d, f, r] = await Promise.all([
        axios.get("http://localhost:5000/api/stats/total-donors"),
        axios.get("http://localhost:5000/api/stats/total-funding"),
        axios.get("http://localhost:5000/api/stats/total-requests"),
      ]);
      setStats({
        donors: d.data.total,
        funding: f.data.total,
        requests: r.data.total,
      });
    };
    load();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid) return;
      try {
        const profileRes = await axios.get(
          `http://localhost:5000/api/users/${user.uid}`
        );
        setProfile(profileRes.data);

        const requestsRes = await axios.get(
          "http://localhost:5000/api/requests",
          {
            params: { uid: user.uid, page: 1, limit: 3 },
          }
        );
        setRecent(requestsRes.data.items || []);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    loadData();
  }, [user?.uid]);

  const updateStatus = async (id, next) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/requests/${id}`,
        { status: next },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      setRecent((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: next } : r))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Delete this request?")) return;

    try {
      const token = await user.getIdToken();

      await axios.delete(`http://localhost:5000/api/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecent((prev) => prev.filter((r) => r._id !== id));
      toast.success("Request deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold break-words">
          Welcome, {profile?.name || user?.displayName || "Donor"} 👋
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage your recent donation requests below.
        </p>
      </div>

      {/* Recent requests */}
      {recent.length > 0 && (
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4">
            Your recent donation requests
          </h3>

          {/* On mobile, show cards instead of wide table */}
          <div className="block sm:hidden space-y-4">
            {recent.map((r) => (
              <div key={r._id} className="border rounded p-3 space-y-1">
                <p>
                  <span className="font-semibold">Recipient:</span>{" "}
                  {r.recipientName}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {r.recipientDistrict}, {r.recipientUpazila}
                </p>
                <p>
                  <span className="font-semibold">Date:</span> {r.donationDate}
                </p>
                <p>
                  <span className="font-semibold">Time:</span> {r.donationTime}
                </p>
                <p>
                  <span className="font-semibold">Blood:</span> {r.bloodGroup}
                </p>
                <p>
                  <span className="font-semibold">Status:</span> {r.status}
                </p>
                <p>
                  <span className="font-semibold">Donor Info:</span>{" "}
                  {r.status === "inprogress"
                    ? `${r.donorName} (${r.donorEmail})`
                    : "—"}
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  {r.status === "inprogress" && (
                    <>
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded"
                        onClick={() => updateStatus(r._id, "done")}
                      >
                        Done
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-600 text-white rounded"
                        onClick={() => updateStatus(r._id, "canceled")}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  <Link
                    to={`/dashboard/requests/${r._id}/edit`}
                    className="text-center px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Edit
                  </Link>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => deleteRequest(r._id)}
                  >
                    Delete
                  </button>
                  <Link
                    to={`/requests/${r._id}`}
                    className="text-center px-3 py-1 bg-black text-white rounded"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm md:text-base">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Recipient</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Time</th>
                  <th className="p-2">Blood</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Donor Info</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r._id} className="border-b">
                    <td className="p-2">{r.recipientName}</td>
                    <td className="p-2">
                      {r.recipientDistrict}, {r.recipientUpazila}
                    </td>
                    <td className="p-2">{r.donationDate}</td>
                    <td className="p-2">{r.donationTime}</td>
                    <td className="p-2">{r.bloodGroup}</td>
                    <td className="p-2 capitalize">{r.status}</td>
                    <td className="p-2">
                      {r.status === "inprogress"
                        ? `${r.donorName} (${r.donorEmail})`
                        : "—"}
                    </td>
                    <td className="p-2">
                      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                        {r.status === "inprogress" && (
                          <>
                            <button
                              className="px-3 py-1 bg-green-600 text-white rounded w-full sm:w-auto"
                              onClick={() => updateStatus(r._id, "done")}
                            >
                              Done
                            </button>
                            <button
                              className="px-3 py-1 bg-gray-600 text-white rounded w-full sm:w-auto"
                              onClick={() => updateStatus(r._id, "canceled")}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <Link
                          to={`/dashboard/requests/${r._id}/edit`}
                          className="px-3 py-1 bg-blue-600 text-white rounded w-full sm:w-auto"
                        >
                          Edit
                        </Link>
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded w-full sm:w-auto"
                          onClick={() => deleteRequest(r._id)}
                        >
                          Delete
                        </button>
                        <Link
                          to={`/requests/${r._id}`}
                          className="px-3 py-1 bg-black text-white rounded w-full sm:w-auto "
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <Link
              to="/dashboard/my-donation-requests"
              className="px-4 py-2 bg-gray-900 text-white rounded block text-center"
            >
              View my all requests
            </Link>
          </div>
        </div>
      )}

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon="🫶"
          title="Total donors"
          value={stats.donors}
          color="bg-red-600"
        />
        <StatCard
          icon="💰"
          title="Total funding"
          value={`৳ ${stats.funding}`}
          color="bg-emerald-600"
        />
        <StatCard
          icon="🩸"
          title="Total requests"
          value={stats.requests}
          color="bg-indigo-600"
        />
      </div> */}

      {/* Extra section for admin/volunteer */}
      {(profile?.role === "admin" || profile?.role === "volunteer") && (
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4">
            Management Links
          </h3>
          <div className="flex flex-col sm:flex-row gap-2">
            {profile.role === "admin" && (
              <>
                {/* <Link
                  to="/dashboard/admin"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded text-center"
                >
                  Admin Home
                </Link> */}
                <Link
                  to="/dashboard/admin/create-blog"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded text-center"
                >
                  Write Blog
                </Link>
                <Link
                  to="/dashboard/all-users"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded text-center"
                >
                  Manage All Users
                </Link>
              </>
            )}
            <Link
              to="/dashboard/all-blood-donation-request"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded text-center"
            >
              View All Donation Requests
            </Link>
          </div>
        </div>
      )}
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
      <div
        className={`w-12 h-12 ${color} text-white rounded flex items-center justify-center text-xl`}
      >
        {icon}
      </div>
    </div>
  );
}
