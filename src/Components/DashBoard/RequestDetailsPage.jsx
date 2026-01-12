// src/pages/RequestDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ helper: 3 months (90 days) rule


export default function RequestDetailsPage() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [request, setRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/requests/${id}`
        );
        setRequest(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  // ✅ confirm donation with validation
  const confirmDonation = async () => {
    // 1️⃣ blood group check
    if (profile?.bloodGroup !== request.bloodGroup) {
      toast.error("❌ Your blood group does not match this request");
      return;
    }

    // 2️⃣ 3 months rule
    if (!isEligibleByDate(profile?.lastDonationDate)) {
      toast.error("❌ You must wait at least 3 months before donating again");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5000/api/requests/${id}/confirm`,
        {
          donorName: profile?.name || user.displayName,
          donorEmail: profile?.email || user.email,
          donorBloodGroup: profile?.bloodGroup,
          lastDonationDate: profile?.lastDonationDate,
        }
      );

      toast.success("✅ Donation confirmed!");
      setShowModal(false);

      // reload request
      const res = await axios.get(
        `http://localhost:5000/api/requests/${id}`
      );
      setRequest(res.data);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to confirm donation"
      );
    }
  };

  if (!request) return <p>Loading...</p>;

  const bloodMatch = profile?.bloodGroup === request.bloodGroup;
  const eligibleByDate = isEligibleByDate(profile?.lastDonationDate);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-2xl font-semibold mb-6">
        Donation Request Details
      </h2>

      <div className="p-6 border rounded bg-white space-y-4">
        <p><strong>Recipient:</strong> {request.recipientName}</p>
        <p>
          <strong>Location:</strong> {request.recipientDistrict},{" "}
          {request.recipientUpazila}
        </p>
        <p><strong>Hospital:</strong> {request.hospitalName}</p>
        <p><strong>Address:</strong> {request.addressLine}</p>
        <p><strong>Blood Group:</strong> {request.bloodGroup}</p>
        <p><strong>Date:</strong> {request.donationDate}</p>
        <p><strong>Time:</strong> {request.donationTime}</p>
        <p><strong>Message:</strong> {request.requestMessage}</p>
      </div>

      {request.status === "pending" && (
          <>
            {user ? (
              <>
                {/* Info paragraph */}
                <p className="mb-4 text-red-600 font-medium">
                  ℹ️ You can see the "Donate" button only if your blood group matches the requested blood group and your last donation date is at least 3 months ago.
                </p>

                {/* Donate button */}
                <button
                  disabled={!bloodMatch || !eligibleByDate}
                  onClick={() => {
                    if (!bloodMatch) {
                      toast.error("❌ Blood group does not match");
                      return;
                    }
                    if (!eligibleByDate) {
                      toast.error("❌ You are not eligible yet (3 months rule)");
                      return;
                    }
                    setShowModal(true);
                  }}
                  className={`mt-2 px-6 py-2 rounded text-white ${
                    bloodMatch && eligibleByDate
                      ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Donate
                </button>
              </>
            ) : (
              <p className="mt-6 text-red-600 font-medium">
                ❗ Please <a href="/login" className="underline">login</a> to donate
              </p>
            )}
          </>
        )}


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Donation
            </h3>

            <div className="mb-4">
              <label className="block text-sm text-gray-600">
                Donor Name
              </label>
              <input
                value={profile?.name || user.displayName}
                readOnly
                className="w-full px-3 py-2 border rounded bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600">
                Donor Email
              </label>
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



function isEligibleByDate(lastDonationDate) {
  if (!lastDonationDate) return true; // never donated

  const lastDate = new Date(lastDonationDate);
  const today = new Date();

  const diffInDays =
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

  return diffInDays >= 90;
}