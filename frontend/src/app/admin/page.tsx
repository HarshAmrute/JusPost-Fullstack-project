"use client";

import { useState, useCallback, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { API_URL } from '@/utils/api';
import { FiUsers, FiFileText, FiShield } from 'react-icons/fi';
import AdminPosts from '@/components/AdminPosts';
import ParticleBackground from '@/components/ParticleBackground';

interface ManagedUser {
  _id: string;
  username: string;
  nickname: string;
  role: 'admin' | 'user';
}

const UserManagement = ({ adminUsername, token }: { adminUsername: string | null, token: string | null }) => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const handleDeleteUser = async (usernameToDelete: string) => {
    if (!adminUsername) {
      alert('Admin user not identified. Cannot delete user.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the user "${usernameToDelete}"? This will anonymize their posts.`)) return;

    // The backend expects the admin's username as a query parameter for authorization
    const requestUrl = `${API_URL}/users/${usernameToDelete}?adminUsername=${adminUsername}`;

    try {
      const response = await fetch(requestUrl, { 
        method: 'DELETE',
      });

      if (!response.ok) {
        // Try to parse the error message from the backend
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response.' }));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      // Optimistically update the UI
      setUsers((prev) => prev.filter((u) => u.username !== usernameToDelete));
      alert('User deleted successfully!');

    } catch (err: any) {
      console.error('Caught an error during delete operation:', err);
      alert(err.message || 'An unexpected error occurred.');
    }
  };

  const fetchUsers = useCallback(async () => {
    if (!adminUsername) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/users?adminUsername=${adminUsername}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      if (data.success) setUsers(data.data);
      else throw new Error(data.message || 'An unknown error occurred');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [adminUsername]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(u => (u.username + ' ' + u.nickname + ' ' + u.role).toLowerCase().includes(search.toLowerCase()));

  if (loading) return <p className="text-center py-10">Loading users...</p>;
  if (error) return <p className="text-red-500 text-center py-10">Error: {error}</p>;

  return (
    <>
    <div className="mb-4">
      <input type="text" placeholder="Search users..." className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white" value={search} onChange={(e)=>setSearch(e.target.value)} />
    </div>
    <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800/50 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/70">
            <tr>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">Nickname</th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">User ID</th>
<th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredUsers.map((user) => (
  <tr key={user.username} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
    <td className="px-6 py-4 whitespace-nowrap font-medium">{user.username}</td>
    <td className="px-6 py-4 whitespace-nowrap">{user.nickname}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 w-fit ${
        user.role === 'admin'
          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      }`}>
        {user.role === 'admin' && <FiShield size={12} />}
        {user.role}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-500 dark:text-gray-400">{user._id}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      {user.username !== adminUsername && (
        <button
          onClick={() => handleDeleteUser(user.username)}
          className="px-3 py-1 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors text-xs"
        >
          Delete
        </button>
      )}
    </td>
  </tr>
))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default function AdminPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('posts');

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-500 dark:text-gray-400">You must be an admin to view this page.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'posts', label: 'Post Management', icon: FiFileText },
    { id: 'users', label: 'User Management', icon: FiUsers },
  ];

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <ParticleBackground className="absolute inset-0" preset="light" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="mb-8 border-b border-gray-200 dark:border-gray-800">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${ 
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-700'
                } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          {activeTab === 'posts' && <AdminPosts adminUsername={user?.username} />}
          {activeTab === 'users' && <UserManagement adminUsername={user?.username} token={user?.token} />}
        </div>
      </div>
    </div>
  );
}
