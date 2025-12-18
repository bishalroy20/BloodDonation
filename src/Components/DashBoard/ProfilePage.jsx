// src/pages/dashboard/ProfilePage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../Contexts/AuthProvider";

export default function ProfilePage() {
  const { user } = useAuth(); // only Firebase user
  const [profile, setProfile] = useState(null); // local profile state

  const [form, setForm] = useState({
    name: "",
    email: "",
    avatarUrl: "",
    bloodGroup: "",
    district: "",
    upazila: "",
  });
  const [editing, setEditing] = useState(false);

  // Load profile from backend
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user.uid}`);
        setProfile(res.data); // now includes role and status
        setForm({
          name: res.data.name || user?.displayName || "",
          email: res.data.email || user?.email || "",
          avatarUrl: res.data.avatarUrl || "",
          bloodGroup: res.data.bloodGroup || "",
          district: res.data.district || "",
          upazila: res.data.upazila || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    loadProfile();
  }, [user]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${user.uid}`, {
        name: form.name,
        avatarUrl: form.avatarUrl,
        bloodGroup: form.bloodGroup,
        district: form.district,
        upazila: form.upazila,
      });
      toast.success("Profile updated");
      setEditing(false);
      // reload profile after save
      const res = await axios.get(`http://localhost:5000/api/users/${user.uid}`);
      setProfile(res.data);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My profile</h2>
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
          <label className="block text-sm text-gray-600">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            disabled={!editing}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Email (read-only)</label>
          <input
            name="email"
            value={form.email}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600">Avatar URL</label>
          <input
            name="avatarUrl"
            value={form.avatarUrl}
            onChange={onChange}
            disabled={!editing}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Blood group</label>
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={onChange}
            disabled={!editing}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
            <option>O+</option><option>O-</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600">District</label>
          <input
            name="district"
            value={form.district}
            onChange={onChange}
            disabled={!editing}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Upazila</label>
          <input
            name="upazila"
            value={form.upazila}
            onChange={onChange}
            disabled={!editing}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </form>

      <div className="mt-6 text-sm text-gray-600">
        <p><span className="font-semibold">Role:</span> {profile?.role}</p>
        <p><span className="font-semibold">Status:</span> {profile?.status}</p>
      </div>
    </div>
  );
}