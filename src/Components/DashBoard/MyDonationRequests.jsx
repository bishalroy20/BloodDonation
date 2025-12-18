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
      const res = await axios.get("http://localhost:5000/api/requests", {
        params: { uid: user.uid, status, page, limit }, // ✅ use user.uid
      });
      setData(res.data.items || []);
      setTotal(res.data.total || 0);
    };
    load();
  }, [user?.uid, status, page, limit]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold">My donation requests</h2>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
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
        <table className="min-w-full text-sm">
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
                <td className="p-2">{r.recipientDistrict}, {r.recipientUpazila}</td>
                <td className="p-2">{r.donationDate}</td>
                <td className="p-2">{r.donationTime}</td>
                <td className="p-2">{r.bloodGroup}</td>
                <td className="p-2 capitalize">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="px-3 py-1">Page {page} / {totalPages}</span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}