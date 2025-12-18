import React from "react";
import { Link } from "react-router-dom";

export default function ErrorPage({ message }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white px-4">
      <h1 className="text-6xl font-bold mb-4">😵 Oops!</h1>
      <p className="text-xl text-gray-400 mb-6">
        {message || "Page not found or something went wrong."}
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded font-semibold text-black transition"
      >
        Go Home
      </Link>
    </div>
  );
}
