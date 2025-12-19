// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-red-700 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid sm:grid-cols-3 gap-8">
        <div>
          <h3 className="font-semibold mb-2">Blood Donation</h3>
          <p className="text-sm text-red-100">
            A community platform connecting donors with those in need.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Links</h3>
          <ul className="space-y-2 text-red-100">
            <li><Link to="/requests" className="hover:text-white">Donation requests</Link></li>
            <li><Link to="/search-donors" className="hover:text-white">Search donors</Link></li>
            <li><Link to="/funding" className="hover:text-white">Funding</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-red-100">support@blooddonation.org</p>
          <p className="text-red-100">+880-1XXX-XXXXXX</p>
        </div>
      </div>
      <div className="bg-red-800 text-red-100 text-center py-3 text-sm">
        © {new Date().getFullYear()} Blood Donation. All rights reserved.
      </div>
    </footer>
  );
}