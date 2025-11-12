import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import api from '../lib/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      const fetchedUsers = response.data.users || [];

      // Sort by createdAt descending
      fetchedUsers.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setUsers(fetchedUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.patch(`/auth/role/${userId}`, { role: newRole });
      
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast.success('User role updated successfully');
      setEditingRole(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update user role';
      toast.error(errorMessage);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      await api.patch(`/users/${userId}`, { status: newStatus });
      
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update user status';
      toast.error(errorMessage);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) return;

    try {
      await api.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      toast.error(errorMessage);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'text-purple-400 bg-purple-500/20 border-purple-500/50';
      case 'faculty': return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
      case 'student': return 'text-green-400 bg-green-500/20 border-green-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getStatusBadgeColor = (status) => {
    return status === 'active' 
      ? 'text-green-400 bg-green-500/20 border-green-500/50'
      : 'text-red-400 bg-red-500/20 border-red-500/50';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          User Management
        </h2>
        <p className="text-gray-400 mt-1">Manage users, roles, and permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', count: users.length, icon: '👥' },
          { label: 'Students', count: users.filter(u => u.role === 'student').length, icon: '🎓' },
          { label: 'Faculty', count: users.filter(u => u.role === 'faculty').length, icon: '👨‍🏫' },
          { label: 'Admins', count: users.filter(u => u.role === 'admin').length, icon: '🔑' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl p-4 rounded-xl border border-green-500/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.count}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-green-500/20">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All Roles' },
              { value: 'student', label: 'Students' },
              { value: 'faculty', label: 'Faculty' },
              { value: 'admin', label: 'Admins' },
            ].map(({ value, label }) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRoleFilter(value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  roleFilter === value
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl border border-green-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-400">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-400">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-400">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-400">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{user.department || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {editingRole === user.id ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          onBlur={() => setEditingRole(null)}
                          className="px-3 py-1 bg-gray-800 border border-green-500 rounded-lg text-white text-sm focus:outline-none"
                          autoFocus
                        >
                          <option value="student">Student</option>
                          <option value="faculty">Faculty</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span
                          onClick={() => setEditingRole(user.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer hover:opacity-80 transition-opacity ${getRoleBadgeColor(user.role)}`}
                        >
                          {user.role?.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(user.status || 'active')}`}>
                        {(user.status || 'active').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleStatus(user.id, user.status || 'active')}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                            (user.status || 'active') === 'active'
                              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                              : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                          }`}
                        >
                          {(user.status || 'active') === 'active' ? 'Deactivate' : 'Activate'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedUser(user)}
                          className="px-3 py-1 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-all"
                        >
                          View
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No users found
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl p-8 rounded-2xl border border-green-500/30 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedUser.name}</h3>
                    <p className="text-gray-400">{selectedUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Role</label>
                    <p className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getRoleBadgeColor(selectedUser.role)}`}>
                      {selectedUser.role?.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Status</label>
                    <p className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadgeColor(selectedUser.status || 'active')}`}>
                      {(selectedUser.status || 'active').toUpperCase()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Department</label>
                  <p className="mt-1 text-white">{selectedUser.department || 'Not specified'}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Phone</label>
                  <p className="mt-1 text-white">{selectedUser.phone || 'Not specified'}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Joined</label>
                  <p className="mt-1 text-white">
                    {selectedUser.createdAt ? format(new Date(selectedUser.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-700 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleToggleStatus(selectedUser.id, selectedUser.status || 'active')}
                    className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all ${
                      (selectedUser.status || 'active') === 'active'
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {(selectedUser.status || 'active') === 'active' ? 'Deactivate User' : 'Activate User'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteUser(selectedUser.id, selectedUser.name)}
                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                  >
                    Delete User
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
