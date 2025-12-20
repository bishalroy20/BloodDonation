// src/pages/dashboard/AllUsersPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthProvider";

export default function AllUsersPage() {
  const { profile } = useAuth();
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const loadUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      let allUsers = res.data || [];

      if (statusFilter) {
        allUsers = allUsers.filter((u) => u.status === statusFilter);
      }

      setTotal(allUsers.length);

      const start = (page - 1) * limit;
      const end = start + limit;
      setUsers(allUsers.slice(start, end));
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  useEffect(() => {
    if (profile?.role === "admin") {
      loadUsers();
    }
  }, [profile, statusFilter, page, limit]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const updateStatus = async (id, nextStatus) => {
    await axios.patch(`http://localhost:5000/api/users/${id}/status`, { status: nextStatus });
    loadUsers();
  };

  const updateRole = async (id, nextRole) => {
    await axios.patch(`http://localhost:5000/api/users/${id}/role`, { role: nextRole });
    loadUsers();
  };

  if (profile === null || profile === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (profile.role !== "admin") {
    return (
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-semibold">Access Denied</h2>
        <p className="text-gray-600">Only admins can view all users.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold">All Users</h2>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded text-sm sm:text-base"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Mobile cards */}
      <div className="block sm:hidden space-y-4">
        {users.map((u) => (
          <div key={u._id} className="border rounded p-3 space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <img
                src={u.avatar || "/default-avatar.png"}
                alt={u.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="font-semibold">{u.name}</p>
            </div>
            <p><span className="font-semibold">Email:</span> {u.email}</p>
            <p><span className="font-semibold">Role:</span> {u.role}</p>
            <p><span className="font-semibold">Status:</span> {u.status}</p>
            <div className="flex flex-col gap-2 mt-2">
              {u.status === "active" && (
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => updateStatus(u._id, "blocked")}
                >
                  Block
                </button>
              )}
              {u.status === "blocked" && (
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => updateStatus(u._id, "active")}
                >
                  Unblock
                </button>
              )}
              {u.role !== "volunteer" && (
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => updateRole(u._id, "volunteer")}
                >
                  Make Volunteer
                </button>
              )}
              {u.role !== "admin" && (
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => updateRole(u._id, "admin")}
                >
                  Make Admin
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm md:text-base">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Avatar</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <UserRow
                key={u._id}
                u={u}
                updateStatus={updateStatus}
                updateRole={updateRole}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4 text-sm sm:text-base">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 w-full sm:w-auto"
          disabled={page === 1 || totalPages <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="px-3 py-1">Page {page} / {totalPages}</span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 w-full sm:w-auto"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}


// ✅ Inline UserRow component with toggle state
function UserRow({ u, updateStatus, updateRole }) {
  const [open, setOpen] = useState(false);

  return (
    <tr className="border-b">
      <td className="p-2">
        <img
          src={u.avatar || "/default-avatar.png"}
          alt={u.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td className="p-2">{u.name}</td>
      <td className="p-2">{u.email}</td>
      <td className="p-2 capitalize">{u.role}</td>
      <td className="p-2 capitalize">{u.status}</td>
      <td className="p-2">
        <div className="relative inline-block text-left">
          <button
            onClick={() => setOpen(!open)}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            ⋮
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
              {u.status === "active" && (
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    updateStatus(u._id, "blocked");
                    setOpen(false);
                  }}
                >
                  Block
                </button>
              )}
              {u.status === "blocked" && (
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    updateStatus(u._id, "active");
                    setOpen(false);
                  }}
                >
                  Unblock
                </button>
              )}
              {u.role !== "volunteer" && (
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    updateRole(u._id, "volunteer");
                    setOpen(false);
                  }}
                >
                  Make Volunteer
                </button>
              )}
              {u.role !== "admin" && (
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    updateRole(u._id, "admin");
                    setOpen(false);
                  }}
                >
                  Make Admin
                </button>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
