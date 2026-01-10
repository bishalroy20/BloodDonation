import { useState } from "react";
import axios from "axios";

export default function CreateBlog() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=aa7cc99fc48cd7b4535b604b6633af61`,
        form
      );
      setFormData({ ...formData, image: res.data.data.url });
    } catch (err) {
      console.error("Image upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/blogs`, formData);
      alert("Blog posted successfully!");
      setFormData({ title: "", content: "", image: "" });
    } catch (err) {
      console.error("Blog post failed", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Blood Donation Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          type="text"
          placeholder="Blog Title"
          className="w-full border px-4 py-2 rounded"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Blog Content"
          className="w-full border px-4 py-2 rounded h-40"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <input type="file" onChange={handleImageUpload} />
        {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
        {formData.image && (
          <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded" />
        )}
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
        >
          Post Blog
        </button>
      </form>
    </div>
  );
}
