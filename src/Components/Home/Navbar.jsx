// src/components/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthProvider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOutUser } = useAuth();

  return (
    <nav className="bg-red-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
        {/* Logo */}
        <Link to="" className="text-xl font-bold">🩸 Blood Donation</Link>

        {/* Hamburger for mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden p-2 rounded-md focus:outline-none"
        >
          {isOpen ? "✖" : "☰"}
        </button>

        {/* Desktop links */}
        <div className="hidden sm:flex space-x-6">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          <Link to="" className="hover:text-gray-200">Requests</Link>
          <Link to="" className="hover:text-gray-200">Volunteer</Link>
          <Link to="" className="hover:text-gray-200">Admin</Link>
          {!user ? (
            <>
              <Link to="/login" className="hover:text-gray-200">Login</Link>
              <Link to="/register" className="hover:text-gray-200">Register</Link>
            </>
          ) : (
            <button onClick={signOutUser} className="hover:text-gray-200">Logout</button>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-2">
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="" onClick={() => setIsOpen(false)}>Requests</Link>
          <Link to="" onClick={() => setIsOpen(false)}>Volunteer</Link>
          <Link to="" onClick={() => setIsOpen(false)}>Admin</Link>
          {!user ? (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
            </>
          ) : (
            <button onClick={() => { signOutUser(); setIsOpen(false); }}>Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}