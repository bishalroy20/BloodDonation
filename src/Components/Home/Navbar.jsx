// src/components/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthProvider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, signOutUser } = useAuth();

  return (
    <nav className="bg-red-600 text-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
        {/* Logo */}
        <Link to="/" className="text-lg sm:text-xl font-bold flex-shrink-0">
          🩸 Blood Donation
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center space-x-6">
          <Link to="/requests" className="hover:text-gray-200 cursor-pointer">
            Donation requests
          </Link>

          <Link
            to="/dashboard/create-donation-request"
            className="hover:text-gray-200 cursor-pointer"
          >
            Create Donation
          </Link>
          <Link to="/blogs" className="hover:text-gray-200">
            Blogs
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="hover:text-gray-200">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-200">
                Join as donor
              </Link>
            </>
          ) : (
            <>
              {/* <Link to="/funding" className="hover:text-gray-200">
                Funding
              </Link> */}

              {/* Avatar dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 bg-red-700 px-3 py-1 rounded"
                >
                  <img
                    src={
                      profile?.avatarUrl ||
                      "https://ui-avatars.com/api/?name=User"
                    }
                    alt="avatar"
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm truncate max-w-[120px]">
                    {profile?.name || user?.email}
                  </span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-md z-20">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        signOutUser();
                        setMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden p-2 rounded-md focus:outline-none"
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-2 flex flex-col">
          <Link
            to="/requests"
            onClick={() => setIsOpen(false)}
            className="block py-2 border-b border-red-200"
          >
            Donation requests
          </Link>
          <Link
            to="/blogs"
            onClick={() => setIsOpen(false)}
            className="block py-2 border-b border-red-200"
          >
            Blogs
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block py-2 border-b border-red-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block py-2 border-b border-red-200"
              >
                Join as donor
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/funding"
                onClick={() => setIsOpen(false)}
                className="block py-2 border-b border-red-200"
              >
                Funding
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block py-2 border-b border-red-200"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  signOutUser();
                  setIsOpen(false);
                }}
                className="block w-full text-left py-2 border-b border-red-200 cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
