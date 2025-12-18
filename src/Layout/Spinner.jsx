// src/components/Spinner.jsx
import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-800">
      <span className="loading loading-spinner loading-lg text-blue-500"></span>
    </div>
  );
};

export default Spinner;
