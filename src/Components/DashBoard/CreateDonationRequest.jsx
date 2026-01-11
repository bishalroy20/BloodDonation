// src/pages/dashboard/CreateDonationRequest.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateDonationRequest() {
  const { user, profile } = useAuth();

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

  // Load districts
  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then(setDistricts)
      .catch(() => toast.error("Failed to load districts"));
  }, []);

  // Handle input change
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

  // ✅ Validate date & time
  const isDateTimeValid = () => {
    if (!form.donationDate || !form.donationTime) return false;

    const selectedDateTime = new Date(
      `${form.donationDate}T${form.donationTime}`
    );
    const now = new Date();

    if (selectedDateTime <= now) {
      toast.error("Donation date and time must be in the future");
      return false;
    }

    return true;
  };

  // Submit
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      toast.error("User not loaded");
      return;
    }

    const normalizedStatus = String(profile?.status || "active")
      .trim()
      .toLowerCase();

    if (normalizedStatus !== "active") {
      toast.error("Blocked users cannot create a donation request.");
      return;
    }

    // ❌ Invalid date/time
    if (!isDateTimeValid()) return;

    try {
      await axios.post("http://localhost:5000/api/requests", {
        requesterUid: user.uid,
        requesterName: profile?.name,
        requesterEmail: profile?.email,
        ...form,
      });

      toast.success("Donation request created successfully");

      setForm({
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
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create request");
    }
  };

  return (
    <div className="bg-white rounded shadow p-6 max-w-4xl mx-auto">
      <ToastContainer position="top-right" autoClose={2500} />
      <h2 className="text-xl font-semibold mb-6">Create Donation Request</h2>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm text-gray-600">Requester Name</label>
          <input
            value={profile?.name || ""}
            readOnly
            className="w-full px-3 py-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Requester Email</label>
          <input
            value={profile?.email || ""}
            readOnly
            className="w-full px-3 py-2 border rounded bg-gray-100"
          />
        </div>

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

        <div>
          <label className="block text-sm text-gray-600">Donation Date</label>
          <input
            type="date"
            name="donationDate"
            min={new Date().toISOString().split("T")[0]}
            value={form.donationDate}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

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

        <div className="md:col-span-2">
          <button
            type="submit"
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
}
