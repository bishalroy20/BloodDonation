// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Blood Donation App. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <Link to="" className="hover:text-white">About</Link>
          <Link to="" className="hover:text-white">Contact</Link>
          <Link to="" className="hover:text-white">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}