import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthProvider";
import { Link } from "react-router-dom";

export default function DonorHome() {
  const { profile } = useAuth();   // profile contains uid, name, email, role
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!profile?.uid) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/requests?uid=${profile.uid}&limit=3`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setRecent(res.data || []);
      } catch (err) {
        console.error("Failed to load requests", err);
      }
    };
    load();
  }, [profile?.uid]);

  const updateStatus = async (id, next) => {
    await axios.patch(
      `http://localhost:5000/api/requests/${id}/status`,
      { status: next },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setRecent((prev) => prev.map((r) => (r._id === id ? { ...r, status: next } : r)));
  };

  const deleteRequest = async (id) => {
    if (!confirm("Delete this request?")) return;
    await axios.delete(`http://localhost:5000/api/requests/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setRecent((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold">
          Welcome, {profile?.name || "Donor"} 👋
        </h2>
        <p className="text-gray-600">
          Manage your recent donation requests below.
        </p>
      </div>

      {/* Show max 3 recent requests */}
      {recent.length > 0 ? (
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Your recent donation requests
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
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
                    <td className="p-2 space-x-2">
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
                        className="px-3 py-1 bg-blue-600 text-white rounded"
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
                        to={`/dashboard/requests/${r._id}`}
                        className="px-3 py-1 bg-black text-white rounded"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <Link
              to="/dashboard/my-donation-requests"
              className="px-4 py-2 bg-gray-900 text-white rounded"
            >
              View my all requests
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded shadow p-6">
          <p className="text-gray-600">You have no donation requests yet.</p>
        </div>
      )}
    </div>
  );
}