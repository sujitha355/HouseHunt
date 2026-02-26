import React, { useState, useEffect } from 'react';
import { propertyAPI, bookingAPI } from '../services/api';

function OwnerDashboard() {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('properties');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    propType: '',
    propAddress: '',
    ownerContact: '',
    propAmt: '',
    bedrooms: '',
    addInfo: ''
  });

  useEffect(() => {
    fetchProperties();
    fetchBookings();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data } = await propertyAPI.getMyProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getOwnerRequests();
      setBookings(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await propertyAPI.create(formData);
      setShowForm(false);
      setFormData({ propType: '', propAddress: '', ownerContact: '', propAmt: '', bedrooms: '', addInfo: '' });
      fetchProperties();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this property?')) {
      try {
        await propertyAPI.delete(id);
        fetchProperties();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleBookingStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, status);
      fetchBookings();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Owner Dashboard</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            My Properties
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Booking Requests
          </button>
        </li>
      </ul>

      {activeTab === 'properties' && (
        <>
          <button className="btn btn-success mb-3" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Property'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="card p-3 mb-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Property Type"
                    value={formData.propType}
                    onChange={(e) => setFormData({...formData, propType: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Address"
                    value={formData.propAddress}
                    onChange={(e) => setFormData({...formData, propAddress: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contact"
                    value={formData.ownerContact}
                    onChange={(e) => setFormData({...formData, ownerContact: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Amount"
                    value={formData.propAmt}
                    onChange={(e) => setFormData({...formData, propAmt: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Bedrooms"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                  />
                </div>
                <div className="col-12">
                  <textarea 
                    className="form-control" 
                    placeholder="Additional Info"
                    value={formData.addInfo}
                    onChange={(e) => setFormData({...formData, addInfo: e.target.value})}
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary">Add Property</button>
                </div>
              </div>
            </form>
          )}

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Address</th>
                  <th>Amount</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr key={property._id}>
                    <td>{property.propType}</td>
                    <td>{property.propAddress}</td>
                    <td>${property.propAmt}</td>
                    <td>{property.isAvailable ? 'Yes' : 'No'}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(property._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'bookings' && (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Renter</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td>{booking.propertyId?.propAddress}</td>
                  <td>{booking.username}</td>
                  <td>{booking.userContact}</td>
                  <td>
                    <span className={`badge bg-${
                      booking.status === 'approved' ? 'success' : 
                      booking.status === 'rejected' ? 'danger' : 'warning'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status === 'pending' && (
                      <>
                        <button 
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleBookingStatus(booking._id, 'approved')}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleBookingStatus(booking._id, 'rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
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

export default OwnerDashboard;
