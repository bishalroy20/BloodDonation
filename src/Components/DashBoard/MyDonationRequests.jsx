// src/pages/dashboard/MyDonationRequests.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthProvider";

export default function MyDonationRequests() {
  const { user } = useAuth(); // ✅ use Firebase user
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return;
      const res = await axios.get(
        "https://blood-donation-server-gilt-theta.vercel.app/api/requests",
        {
          params: { uid: user.uid, status, page, limit }, // ✅ use user.uid
        }
      );
      setData(res.data.items || []);
      setTotal(res.data.total || 0);
    };
    load();
  }, [user?.uid, status, page, limit]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="bg-white rounded shadow p-6">
      {/* Header with filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold">
          My donation requests
        </h2>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded text-sm sm:text-base"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* Mobile cards */}
      <div className="block sm:hidden space-y-4">
        {data.map((r) => (
          <div key={r._id} className="border rounded p-3 space-y-1 text-sm">
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
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm md:text-base">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Recipient</th>
              <th className="p-2">Location</th>
              <th className="p-2">Date</th>
              <th className="p-2">Time</th>
              <th className="p-2">Blood</th>
              <th className="p-2">Status</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4 text-sm sm:text-base">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 w-full sm:w-auto"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {page} / {totalPages}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 w-full sm:w-auto"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
