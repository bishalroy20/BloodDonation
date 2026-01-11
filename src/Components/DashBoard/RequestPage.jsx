// src/pages/RequestsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/public/requests"
        );
        setRequests(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Pending Donation Requests</h2>

      {requests.length === 0 && (
        <p className="text-gray-600">No pending requests available.</p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="text-left border-b bg-gray-100">
              <th className="p-2">Recipient</th>
              <th className="p-2">Location</th>
              <th className="p-2">Blood Group</th>
              <th className="p-2">Date</th>
              <th className="p-2">Time</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id} className="border-b">
                <td className="p-2">{r.recipientName}</td>
                <td className="p-2">
                  {r.recipientDistrict}, {r.recipientUpazila}
                </td>
                <td className="p-2">{r.bloodGroup}</td>
                <td className="p-2">{r.donationDate}</td>
                <td className="p-2">{r.donationTime}</td>
                <td className="p-2">
                  <Link
                    to={`/requests/${r._id}`}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
