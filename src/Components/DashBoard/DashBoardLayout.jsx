// src/layouts/DashboardLayout.jsx
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const navItem = (to, label) => (
    <Link
      to={to}
      className={`block px-4 py-2 rounded ${
        pathname === to ? "bg-red-600 text-white" : "text-gray-200 hover:bg-red-500 hover:text-white"
      }`}
      onClick={() => setOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white px-4 py-3">
        <span className="font-bold">🩸 Dashboard</span>
        <button
          className="px-3 py-2 bg-red-600 rounded"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed md:static z-30 top-0 left-0 h-full md:h-auto w-64 bg-gray-900 text-white transform transition-transform duration-200 ${
            open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="px-4 py-4 border-b border-gray-800">
            <span className="text-xl font-bold">🩸 Blood Donation</span>
          </div>
          <nav className="px-2 py-4 space-y-1">
            {navItem("/dashboard", "Home")}
            {navItem("/dashboard/profile", "Profile")}
            {navItem("/dashboard/my-donation-requests", "My donation requests")}
            {navItem("/dashboard/create-donation-request", "Create donation request")}
            {/* Add admin/volunteer links here */}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}