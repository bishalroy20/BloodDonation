// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-red-700 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        {/* About */}
        <div>
          <h3 className="font-semibold mb-2">Blood Donation</h3>
          <p className="text-sm text-red-100">
            A community platform connecting donors with those in need.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-2">Links</h3>
          <ul className="space-y-2 text-red-100">
            <li><Link to="/requests" className="hover:text-white">Donation requests</Link></li>
            <li><Link to="/search-donors" className="hover:text-white">Search donors</Link></li>
            <li><Link to="/funding" className="hover:text-white">Funding</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-red-100">support@blooddonation.org</p>
          <p className="text-red-100">+880-1309482122</p>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <div className="flex flex-wrap gap-4 text-red-100">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-2"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988H7.898v-2.89h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
              Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-2"
            >
              {/* New Twitter X logo */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2H21l-6.52 7.455L22 22h-5.756l-4.49-6.59L7.244 22H3l7.244-8.277L2 2h5.756l4.244 6.244L18.244 2z"/>
              </svg>
              Twitter (X)
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-2"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-2a1.5 1.5 0 11-3.001-.001A1.5 1.5 0 0116.5 5z"/>
              </svg>
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="bg-red-800 text-red-100 text-center py-3 text-sm">
        © {new Date().getFullYear()} Blood Donation. All rights reserved.
      </div>
    </footer>
  );
}
