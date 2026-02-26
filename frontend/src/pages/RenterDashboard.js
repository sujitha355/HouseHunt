import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyAPI, bookingAPI } from '../services/api';

function RenterDashboard() {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({ propType: '', minAmt: '', maxAmt: '' });
  const [activeTab, setActiveTab] = useState('properties');

  useEffect(() => {
    fetchProperties();
    fetchBookings();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data } = await propertyAPI.getAll(filters);
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div>
      <h2 className="mb-4">Renter Dashboard</h2>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            Available Properties
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings
          </button>
        </li>
      </ul>

      {activeTab === 'properties' && (
        <>
          <form onSubmit={handleSearch} className="card p-3 mb-4">
            <div className="row g-3">
              <div className="col-md-4">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Property Type"
                  value={filters.propType}
                  onChange={(e) => setFilters({...filters, propType: e.target.value})}
                />
              </div>
              <div className="col-md-3">
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Min Amount"
                  value={filters.minAmt}
                  onChange={(e) => setFilters({...filters, minAmt: e.target.value})}
                />
              </div>
              <div className="col-md-3">
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Max Amount"
                  value={filters.maxAmt}
                  onChange={(e) => setFilters({...filters, maxAmt: e.target.value})}
                />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100">Search</button>
              </div>
            </div>
          </form>

          <div className="row">
            {properties.map(property => (
              <div key={property._id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{property.propType}</h5>
                    <p className="card-text">{property.propAddress}</p>
                    <p className="text-primary fw-bold">${property.propAmt}/month</p>
                    <Link to={`/property/${property._id}`} className="btn btn-primary">
                      Get Info
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'bookings' && (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Address</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td>{booking.propertyId?.propType}</td>
                  <td>{booking.propertyId?.propAddress}</td>
                  <td>
                    <span className={`badge bg-${
                      booking.status === 'approved' ? 'success' : 
                      booking.status === 'rejected' ? 'danger' : 'warning'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RenterDashboard;
