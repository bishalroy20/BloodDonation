// src/pages/dashboard/ page for admin too or create AdminHome.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthProvider";

export default function AdminHome() {
  

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold">
          Welcome, {profile?.name || "User"} 👋
        </h2>
        <p className="text-gray-600">
          Manage your blood donation platform efficiently.
        </p>
      </div>

      {/* Stats cards */}
      
    </div>
  );
}


