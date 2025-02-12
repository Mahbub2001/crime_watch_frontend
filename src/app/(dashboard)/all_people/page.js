'use client';

import React, { useEffect, useState } from 'react';

function All_People() {
  const [users, setUsers] = useState([]);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all_user`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle banning a user
  const handleBan = async (userId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/ban`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Update the UI by marking the user as banned
        setUsers(users.map(user =>
          user._id === userId ? { ...user, isBanned: true } : user
        ));
      } else {
        console.error("Failed to ban the user");
      }
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-3">Name</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Role</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="border p-3">{user.firstName} {user.lastName || 'N/A'}</td>
                <td className="border p-3">{user.email || 'N/A'}</td>
                <td className="border p-3">{user.role}</td>
                <td className="border p-3 text-center">
                  {user.isBanned ? (
                    <span className="text-red-600 font-bold">Banned</span>
                  ) : (
                    <span className="text-green-600 font-bold">Active</span>
                  )}
                </td>
                <td className="border p-3 text-center">
                  {!user.isBanned && (
                    <button 
                      onClick={() => handleBan(user._id)} 
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                      Ban
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default All_People;
