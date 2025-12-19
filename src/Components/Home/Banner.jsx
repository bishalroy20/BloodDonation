// src/components/Banner.jsx
import { Link } from "react-router-dom";

export default function Banner() {
  return (
    <section className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Give blood. Save lives.
        </h1>
        <p className="text-gray-700 mb-8">
          Join our community of donors and help patients who need you today.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Join as a donor
          </Link>
          <Link
            to="/search-donors"
            className="px-6 py-3 border border-red-600 text-red-600 rounded hover:bg-red-50"
          >
            Search donors
          </Link>
        </div>
      </div>
    </section>
  );
}