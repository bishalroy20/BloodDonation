// src/pages/RequestDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthProvider";

export default function RequestDetailsPage() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [request, setRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/requests/${id}`);
        setRequest(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  const confirmDonation = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/requests/${id}/confirm`, {
        donorName: profile?.name || user.displayName,
        donorEmail: profile?.email || user.email,
      });
      alert("Donation confirmed! Status changed to inprogress.");
      setShowModal(false);
      // reload request
      const res = await axios.get(`http://localhost:5000/api/requests/${id}`);
      setRequest(res.data);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to confirm donation");
    }
  };

  if (!request) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Donation Request Details</h2>
      <div className="p-6 border rounded bg-white space-y-4">
        <p>
          <strong>Recipient:</strong> {request.recipientName}
        </p>
        <p>
          <strong>Location:</strong> {request.recipientDistrict},{" "}
          {request.recipientUpazila}
        </p>
        <p>
          <strong>Hospital:</strong> {request.hospitalName}
        </p>
        <p>
          <strong>Address:</strong> {request.addressLine}
        </p>
        <p>
          <strong>Blood Group:</strong> {request.bloodGroup}
        </p>
        <p>
          <strong>Date:</strong> {request.donationDate}
        </p>
        <p>
          <strong>Time:</strong> {request.donationTime}
        </p>
        <p>
          <strong>Message:</strong> {request.requestMessage}
        </p>
      </div>

      {request.status === "pending" && (
        <button
          onClick={() => setShowModal(true)}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Donate
        </button>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Donation</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-600">Donor Name</label>
              <input
                value={profile?.name || user.displayName}
                readOnly
                className="w-full px-3 py-2 border rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600">Donor Email</label>
              <input
                value={profile?.email || user.email}
                readOnly
                className="w-full px-3 py-2 border rounded bg-gray-100"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDonation}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
