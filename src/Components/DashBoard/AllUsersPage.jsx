// src/pages/dashboard/AllUsersPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function AllUsersPage() {
  const [filter, setFilter] = useState(""); // "", "active", "blocked"
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const load = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/users", {
      params: { status: filter, page, limit },
    });
    setData(res.data.items);
    setTotal(res.data.total);
  };

  useEffect(() => { load(); }, [filter, page, limit]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const setStatus = async (uid, status) => {
    await axios.patch(`http://localhost:5000/api/admin/users/${uid}/status`, { status });
    load();
  };

  const setRole = async (uid, role) => {
    await axios.patch(`http://localhost:5000/api/admin/users/${uid}/role`, { role });
    load();
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold">All users</h2>
        <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 border rounded">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Avatar</th>
              <th className="p-2">Email</th>
              <th className="p-2">Name</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr key={u.uid} className="border-b">
                <td className="p-2">
                  <img src={u.avatarUrl || "https://via.placeholder.com/40"} alt="" className="w-10 h-10 rounded object-cover" />
                </td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.name}</td>
                <td className="p-2 capitalize">{u.role}</td>
                <td className="p-2 capitalize">{u.status}</td>
                <td className="p-2">
                  <div className="relative inline-block text-left">
                    <details>
                      <summary className="px-3 py-1 bg-gray-800 text-white rounded cursor-pointer">Actions</summary>
                      <div className="mt-2 bg-white border rounded shadow w-48">
                        {u.status === "active" ? (
                          <button className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                                  onClick={() => setStatus(u.uid, "blocked")}>Block</button>
                        ) : (
                          <button className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                                  onClick={() => setStatus(u.uid, "active")}>Unblock</button>
                        )}
                        <button className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                                onClick={() => setRole(u.uid, "volunteer")}>Make volunteer</button>
                        <button className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                                onClick={() => setRole(u.uid, "admin")}>Make admin</button>
                      </div>
                    </details>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-4">
        <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={page === 1 || totalPages <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
            Prev
        </button>

        <span className="px-3 py-1">Page {page} / {totalPages || 1}</span>

        <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={page >= (totalPages || 1)}
            onClick={() => setPage((p) => p + 1)}
        >
            Next
        </button>
        </div>
    </div>
);
}
