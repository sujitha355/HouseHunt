import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

function AdminDashboard() {
  const [pendingOwners, setPendingOwners] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchPendingOwners();
    fetchAllUsers();
  }, []);

  const fetchPendingOwners = async () => {
    try {
      const { data } = await adminAPI.getPendingOwners();
      setPendingOwners(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data } = await adminAPI.getAllUsers();
      setAllUsers(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleApproval = async (id, isApproved) => {
    try {
      await adminAPI.approveOwner(id, isApproved);
      fetchPendingOwners();
      fetchAllUsers();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Approvals ({pendingOwners.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            All Users
          </button>
        </li>
      </ul>

      {activeTab === 'pending' && (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingOwners.map(owner => (
                <tr key={owner._id}>
                  <td>{owner.name}</td>
                  <td>{owner.email}</td>
                  <td>{owner.type}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleApproval(owner._id, true)}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleApproval(owner._id, false)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.type}</td>
                  <td>
                    <span className={`badge bg-${user.isApproved ? 'success' : 'warning'}`}>
                      {user.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
