import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/blogs/${id}`)
      .then((res) => setBlog(res.data))
      .catch((err) => console.error("Failed to load blog", err));
  }, [id]);

  if (!blog)
    return <p className="text-center mt-10 text-gray-500 text-lg">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate("/blogs")}
        className="mb-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded shadow transition"
      >
        ← Back to Blogs
      </button>

      {/* Blog Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-72 md:h-96 object-cover"
        />

        <div className="p-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            {blog.title}
          </h1>

          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
            {blog.content}
          </p>
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line text-red-400">
            {blog.createdAt}
          </p>
        </div>
      </div>
    </div>
  );
}
