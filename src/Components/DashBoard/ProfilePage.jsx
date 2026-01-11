import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../Contexts/AuthProvider";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    avatarUrl: "",
    bloodGroup: "",
    district: "",
    upazila: "",
    lastDonationDate: "",
  });

  const [editing, setEditing] = useState(false);

  /* ================= DATE FORMAT ================= */
  const formatDate = (date) => {
    if (!date) return "Not donated yet";
    return new Date(date).toLocaleDateString("en-GB");
  };

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${user.uid}`
        );

        if (!res.data) return;

        setProfile(res.data);

        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          avatarUrl: res.data.avatarUrl || "",
          bloodGroup: res.data.bloodGroup || "",
          district: res.data.district || "",
          upazila: res.data.upazila || "",
          lastDonationDate: res.data.lastDonationDate
            ? res.data.lastDonationDate.split("T")[0]
            : "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    loadProfile();
  }, [user]);

  /* ================= FORM CHANGE ================= */
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= SAVE ================= */
  const onSave = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${user.uid}`, {
        name: form.name,
        avatarUrl: form.avatarUrl,
        bloodGroup: form.bloodGroup,
        district: form.district,
        upazila: form.upazila,
        lastDonationDate: form.lastDonationDate || null,
      });

      toast.success("Profile updated");
      setEditing(false);

      const res = await axios.get(
        `http://localhost:5000/api/users/${user.uid}`
      );
      setProfile(res.data);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My Profile</h2>

        {!editing ? (
          <button
            className="px-4 py-2 bg-gray-900 text-white rounded"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={onSave}
          >
            Save
          </button>
        )}
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            disabled={!editing}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Email</label>
          <input
            value={form.email}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm">Avatar URL</label>
          <input
            name="avatarUrl"
            value={form.avatarUrl}
            onChange={onChange}
            disabled={!editing}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Blood Group</label>
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={onChange}
            disabled={!editing}
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
          <label className="block text-sm">District</label>
          <input
            name="district"
            value={form.district}
            onChange={onChange}
            disabled={!editing}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Upazila</label>
          <input
            name="upazila"
            value={form.upazila}
            onChange={onChange}
            disabled={!editing}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* 🔥 LAST DONATION DATE FIELD */}
        <div>
          <label className="block text-sm">Last Donation Date</label>
          <input
            type="date"
            name="lastDonationDate"
            value={form.lastDonationDate}
            onChange={onChange}
            disabled={!editing}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </form>

      {/* ================= EXTRA INFO ================= */}
      <div className="mt-6 text-sm space-y-1">
        <p>
          <strong>Role:</strong> {profile?.role}
        </p>
        <p>
          <strong>Status:</strong> {profile?.status}
        </p>
        <p>
          <strong>Last Donation:</strong>{" "}
          {formatDate(profile?.lastDonationDate)}
        </p>
      </div>
    </div>
  );
}
