// src/components/ContactUs.jsx
import { useState } from "react";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: send to backend or email service
    alert("Message sent. We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Contact us</h2>
          <p className="text-gray-700 mb-2">Phone: +880-1309482122</p>
          <p className="text-gray-700">Email: support@blooddonation.org</p>
        </div>
        <form onSubmit={onSubmit} className="bg-white p-6 rounded border">
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              rows="4"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Send
          </button>
        </form>
      </div>
    </section>
  );
}