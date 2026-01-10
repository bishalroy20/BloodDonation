// src/pages/dashboard/EditDonationRequest.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function EditDonationRequest() {
  const { user } = useAuth();
  const { id } = useParams(); // request id from route
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [form, setForm] = useState({
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    addressLine: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });
  const [loading, setLoading] = useState(true);

  // Load districts
  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then(setDistricts)
      .catch(() => toast.error("Failed to load districts"));
  }, []);

  // Load existing request data
  useEffect(() => {
    if (id) {
      axios
        .get(
          `https://blood-donation-server-gilt-theta.vercel.app/api/requests/${id}`
        )
        .then((res) => {
          setForm(res.data);
          const selected = districts.find(
            (d) => d.name === res.data.recipientDistrict
          );
          setUpazilas(selected ? selected.upazilas : []);
        })
        .catch(() => toast.error("Failed to load request"))
        .finally(() => setLoading(false));
    }
  }, [id, districts]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      let updated = { ...prev, [name]: value };
      if (name === "recipientDistrict") {
        const selected = districts.find((d) => d.name === value);
        setUpazilas(selected ? selected.upazilas : []);
        updated.recipientUpazila = "";
      }
      return updated;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      toast.error("User not loaded");
      return;
    }

    try {
      await axios.patch(
        `https://blood-donation-server-gilt-theta.vercel.app/api/requests/${id}`,
        form,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      toast.success("Donation request updated successfully");
      navigate("/dashboard/my-donation-requests");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update request");
    }
  };

  if (loading) return <p className="text-center">Loading request...</p>;

  return (
    <div className="bg-white rounded shadow p-6 max-w-4xl mx-auto">
      <ToastContainer position="top-right" autoClose={2500} />
      <h2 className="text-xl font-semibold mb-6">Edit Donation Request</h2>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Recipient Name */}
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600">Recipient Name</label>
          <input
            name="recipientName"
            value={form.recipientName}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-sm text-gray-600">
            Recipient District
          </label>
          <select
            name="recipientDistrict"
            value={form.recipientDistrict}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select district</option>
            {districts.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Upazila */}
        <div>
          <label className="block text-sm text-gray-600">
            Recipient Upazila
          </label>
          <select
            name="recipientUpazila"
            value={form.recipientUpazila}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select upazila</option>
            {upazilas.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        {/* Hospital */}
        <div>
          <label className="block text-sm text-gray-600">Hospital Name</label>
          <input
            name="hospitalName"
            value={form.hospitalName}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm text-gray-600">Full Address</label>
          <input
            name="addressLine"
            value={form.addressLine}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-sm text-gray-600">Blood Group</label>
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>
        </div>

        {/* Donation Date */}
        <div>
          <label className="block text-sm text-gray-600">Donation Date</label>
          <input
            type="date"
            name="donationDate"
            value={form.donationDate}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Donation Time */}
        <div>
          <label className="block text-sm text-gray-600">Donation Time</label>
          <input
            type="time"
            name="donationTime"
            value={form.donationTime}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Message */}
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600">Request Message</label>
          <textarea
            name="requestMessage"
            value={form.requestMessage}
            onChange={onChange}
            rows="4"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="md:col-span-2 flex gap-2">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Request
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
