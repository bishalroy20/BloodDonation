import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function RecentBlogsSwiper() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/blogs?limit=10&sort=desc")
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error("Failed to load blogs", err));
  }, []);

  return (
    <section className="bg-gradient-to-b from-red-100 via-red-200 to-red-300 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-red-600">
          🩸 Latest Blogs
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 5 }, // ✅ lg: 5 cards
          }}
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog._id}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[380px] transition-transform duration-300 hover:scale-105">
                <Link to={`/blogs/${blog._id}`} className="flex flex-col h-full">
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <span className="mt-auto inline-block px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition">
                      Read More
                    </span>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
