// src/pages/dashboard/AllDonationRequestsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthProvider";
import { toast } from "react-toastify";

export default function AllDonationRequestsPage() {
  const { user, profile } = useAuth();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const load = async () => {
    try {
      const token = user?.token || (await user.getIdToken?.());
      const res = await axios.get("http://localhost:5000/api/admin/requests", {
        params: { status, page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Failed to load requests:", err);
      toast.error("Failed to load requests");
    }
  };

  useEffect(() => {
    load();
  }, [status, page, limit]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const updateStatus = async (id, next) => {
    try {
      const token = user?.token || (await user.getIdToken?.());
      await axios.patch(
        `http://localhost:5000/api/admin/requests/${id}/status`,
        { status: next },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      load();
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status");
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    try {
      const token = user?.token || (await user.getIdToken?.());
      await axios.delete(`http://localhost:5000/api/admin/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Request deleted");
      load();
    } catch (err) {
      console.error("Failed to delete request:", err);
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-lg md:text-xl font-semibold">
          All blood donation requests
        </h2>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full text-xs sm:text-sm md:text-base">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Recipient</th>
              <th className="p-2">Location</th>
              <th className="p-2">Date</th>
              <th className="p-2">Time</th>
              <th className="p-2">Blood</th>
              <th className="p-2">Status</th>
              <th className="p-2">Requester</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
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
                  {r.requesterName} ({r.requesterEmail})
                </td>
                <td className="p-2 flex flex-wrap gap-2">
                  {profile?.role === "admin" && (
                    <>
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
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded w-full sm:w-auto"
                        onClick={() => updateStatus(r._id, "inprogress")}
                      >
                        In progress
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded w-full sm:w-auto"
                        onClick={() => deleteRequest(r._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}

                  {profile?.role === "volunteer" && (
                    <span className="text-gray-500">View only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1 || totalPages <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {page} / {totalPages || 1}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= (totalPages || 1)}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
