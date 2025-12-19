import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthProvider";
import { Link } from "react-router-dom";

export default function DonorHome() {
  const { user } = useAuth();
  const [recent, setRecent] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
  const loadData = async () => {
    if (!user?.uid) return;
    try {
      // Load profile
      const profileRes = await axios.get(`http://localhost:5000/api/users/${user.uid}`);
      setProfile(profileRes.data);

      // Load recent requests
      const requestsRes = await axios.get("http://localhost:5000/api/requests", {
        params: { uid: user.uid, page: 1, limit: 3 },
      });
      setRecent(requestsRes.data.items || []);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };
  loadData();
}, [user?.uid]);

  const updateStatus = async (id, next) => {
    await axios.patch(`http://localhost:5000/api/requests/${id}`, { status: next });
    setRecent((prev) => prev.map((r) => (r._id === id ? { ...r, status: next } : r)));
  };

  const deleteRequest = async (id) => {
    if (!confirm("Delete this request?")) return;
    await axios.delete(`http://localhost:5000/api/requests/${id}`);
    setRecent((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl md:text-2xl font-bold">
          Welcome, {profile?.name || user?.displayName || "Donor"} 👋
        </h2>
        <p className="text-gray-600">Manage your recent donation requests below.</p>
      </div>

      {/* Recent requests */}
      {recent.length > 0 && (
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-lg md:text-xl font-semibold mb-4">Your recent donation requests</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm md:text-base">
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
                    <td className="p-2">{r.recipientDistrict}, {r.recipientUpazila}</td>
                    <td className="p-2">{r.donationDate}</td>
                    <td className="p-2">{r.donationTime}</td>
                    <td className="p-2">{r.bloodGroup}</td>
                    <td className="p-2 capitalize">{r.status}</td>
                    <td className="p-2">
                      {r.status === "inprogress" ? `${r.donorName} (${r.donorEmail})` : "—"}
                    </td>
                    <td className="p-2 space-x-2 flex flex-wrap gap-2">
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
                      <Link to={`/dashboard/requests/${r._id}/edit`} className="px-3 py-1 bg-blue-600 text-white rounded">
                        Edit
                      </Link>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded"
                        onClick={() => deleteRequest(r._id)}
                      >
                        Delete
                      </button>
                      <Link to={`/dashboard/requests/${r._id}`} className="px-3 py-1 bg-black text-white rounded">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <Link to="/dashboard/my-donation-requests" className="px-4 py-2 bg-gray-900 text-white rounded">
              View my all requests
            </Link>
          </div>
        </div>
      )}

      {/* Extra section for admin/volunteer */}
      {(profile?.role === "admin" || profile?.role === "volunteer") && (
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-lg md:text-xl font-semibold mb-4">Management Links</h3>
          <div className="flex flex-col md:flex-row gap-2">
            {profile.role === "admin" && (
              <>
                <Link to="/dashboard/admin" className="flex-1 px-4 py-2 bg-red-600 text-white rounded text-center">
                  Admin Home
                </Link>
                <Link to="/dashboard/all-users" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded text-center">
                  Manage All Users
                </Link>
              </>
            )}
            <Link to="/dashboard/all-blood-donation-request" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded text-center">
              View All Donation Requests
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}