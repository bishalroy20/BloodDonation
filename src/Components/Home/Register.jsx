// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../Firebase/firebase.init";
import axios from "axios"; // 👈 add axios
import { toast, ToastContainer } from "react-toastify"; // 👈 add toast
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    confirm_password: "",
    avatarFile: null,
    bloodGroup: "",
    district: "",
    upazila: "",
  });
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));

    if (name === "district") {
      const selected = districts.find((d) => d.name === value);
      setUpazilas(selected ? selected.upazilas : []);
    }
  };

  async function uploadToImgBB(file) {
    const apiKey = "aa7cc99fc48cd7b4535b604b6633af61";
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.data.url;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      setMsg("Passwords do not match");
      return;
    }
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      let avatarUrl = "";
      if (form.avatarFile) {
        avatarUrl = await uploadToImgBB(form.avatarFile);
      }

      await updateProfile(cred.user, { displayName: form.name });

      // 👇 Send user info to backend MongoDB
      await axios.post("http://localhost:5000/api/auth/register", {
        uid: cred.user.uid,
        email: cred.user.email,
        name: form.name,
        avatarUrl,
        bloodGroup: form.bloodGroup,
        district: form.district,
        upazila: form.upazila,
      });

      toast.success("✅ Registration successful! You are now a donor.");
      setMsg("Registration successful! You are now a donor.");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("❌ Registration failed");
      setMsg("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-500 to-pink-600">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">📝 Register</h2>
        {msg && <p className="text-center mb-4 text-sm font-medium text-red-500">{msg}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input name="name" type="text" placeholder="Name" onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input name="avatarFile" type="file" accept="image/*" onChange={handleChange} className="w-full text-sm" />

          <select name="bloodGroup" onChange={handleChange} required className="w-full px-4 py-2 border rounded">
            <option value="">Select Blood Group</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
            <option>O+</option><option>O-</option>
          </select>

          <select name="district" onChange={handleChange} required className="w-full px-4 py-2 border rounded">
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.name} value={d.name}>{d.name}</option>
            ))}
          </select>

          <select name="upazila" onChange={handleChange} required className="w-full px-4 py-2 border rounded">
            <option value="">Select Upazila</option>
            {upazilas.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>

          {/* Password with eye toggle */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-red-600"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Confirm Password with eye toggle */}
          <div className="relative">
            <input
              name="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-red-600"
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button type="submit" className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-red-700 transition">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}