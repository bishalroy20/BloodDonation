import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);

  // Fetch blogs
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/blogs")
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error("Failed to load blogs", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-red-600">
        🩸 Blood Donation Blogs
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {blogs.map((blog) => (
          <motion.div
            key={blog._id}
            className="rounded-xl overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-red-400 text-white shadow-lg"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Link
                to={`/blogs/${blog._id}`}
                className="mt-auto inline-block px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded transition"
              >
            {/* Blog Image */}
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover rounded-t-xl"
            />

            {/* Blog Content */}
              <h3 className="text-lg font-bold mb-2">{blog.title}</h3>
              
              
                Read More
              </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
