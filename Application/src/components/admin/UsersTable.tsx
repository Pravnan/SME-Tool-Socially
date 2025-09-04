// src/components/admin/UsersTable.tsx
'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

type User = {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status?: 'active' | 'inactive';
};

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch users from API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users');
        if (!res.ok) throw new Error('Failed to load users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // ✅ Handlers
  const handleAddUser = async () => {
    const name = prompt('Enter name:');
    const email = prompt('Enter email:');
    if (!name || !email) return;

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role: 'user' }),
    });

    if (res.ok) {
      const { userId } = await res.json();
      setUsers([...users, { _id: userId, name, email, role: 'user', status: 'active' }]);
    } else {
      alert('Failed to add user');
    }
  };

  const handleEditUser = async (id: string) => {
    const user = users.find((u) => u._id === id);
    if (!user) return;

    const role = prompt('Enter new role (user/admin):', user.role);
    if (!role) return;

    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    });

    if (res.ok) {
      setUsers(users.map((u) => (u._id === id ? { ...u, role: role as 'user' | 'admin' } : u)));
    } else {
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setUsers(users.filter((u) => u._id !== id));
    } else {
      alert('Failed to delete user');
    }
  };

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">Loading users...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Users</h2>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-white/10">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-200">Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-200">Email</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-200">Role</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-200">Status</th>
              <th className="px-4 py-2 text-right font-medium text-gray-700 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-t border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      u.status !== 'inactive'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}
                  >
                    {u.status || 'active'}
                  </span>
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    onClick={() => handleEditUser(u._id)}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-gray-50 dark:hover:bg-white/10"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
