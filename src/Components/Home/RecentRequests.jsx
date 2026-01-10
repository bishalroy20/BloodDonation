import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RecentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          "https://blood-donation-server-gilt-theta.vercel.app/api/public/requests"
        );

        let data = [];

        // Normalize response
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (Array.isArray(res.data.items)) {
          data = res.data.items;
        } else if (Array.isArray(res.data.requests)) {
          data = res.data.requests;
        }

        // ✅ Sort newest first (MongoDB safe)
        const recentFive = data
          .sort(
            (a, b) =>
              new Date(b.createdAt || b._id) -
              new Date(a.createdAt || a._id)
          )
          .slice(0, 5);

        setRequests(recentFive);
      } catch (err) {
        console.error("Failed to load requests:", err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="bg-gradient-to-b from-sky-200 via-red-300 to-red-400 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">
          🩸 Recent Blood Requests
        </h2>

        {loading && (
          <p className="text-center text-white">Loading requests...</p>
        )}

        {!loading && requests.length === 0 && (
          <p className="text-center text-white">
            No recent requests found
          </p>
        )}

        {!loading && requests.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {requests.map((r) => (
              <div
                key={r._id}
                className="bg-gradient-to-br from-red-500 via-red-400 to-white rounded-xl shadow-lg p-5 text-white hover:shadow-2xl transition"
              >
                <h3 className="text-lg font-bold mb-2">
                  {r.recipientName}
                </h3>

                <p className="text-sm mb-1">
                  <span className="font-semibold">Blood:</span>{" "}
                  {r.bloodGroup}
                </p>

                <p className="text-sm mb-1">
                  <span className="font-semibold">Location:</span>{" "}
                  {r.recipientDistrict}, {r.recipientUpazila}
                </p>

                <p className="text-sm mb-1">
                  <span className="font-semibold">Date:</span>{" "}
                  {r.donationDate}
                </p>

                <p className="text-sm mb-4 capitalize">
                  <span className="font-semibold">Status:</span>{" "}
                  {r.status}
                </p>

                <Link
                  to={`/requests/${r._id}`}
                  className="block text-center bg-white text-red-600 font-semibold py-2 rounded-lg hover:bg-red-100 transition"
                >
                  ❤️ Donate
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/requests"
            className="px-6 py-2 bg-white text-sky-700 font-semibold rounded-lg shadow hover:bg-sky-100 transition"
          >
            View All Requests
          </Link>
        </div>
      </div>
    </section>
  );
}
