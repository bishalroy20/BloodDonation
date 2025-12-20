// src/components/RecentRequests.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RecentRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch the most recent 4 requests
        const res = await axios.get("http://localhost:5000/api/requests", {
          params: { page: 1, limit: 4 },
        });
        setRequests(res.data.items || []);
      } catch (err) {
        console.error("Failed to load requests:", err);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {requests.map((r) => (
            <div
              key={r._id}
              className="relative bg-white rounded-xl shadow-lg p-6 transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Decorative gradient border */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent hover:border-sky-400 transition-colors duration-500"></div>

              <h3 className="text-lg font-semibold text-sky-700 mb-2">
                {r.recipientName}
              </h3>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">Location:</span>{" "}
                {r.recipientDistrict}, {r.recipientUpazila}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">Date:</span> {r.donationDate}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">Time:</span> {r.donationTime}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">Blood:</span> {r.bloodGroup}
              </p>
              <p className="text-gray-600 text-sm mb-3 capitalize">
                <span className="font-semibold">Status:</span> {r.status}
              </p>

              <Link
                to={`/requests/${r._id}`}
                className="inline-block px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors duration-300 hover:bg-sky-700"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
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
