import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyAPI, bookingAPI } from '../services/api';

function PropertyDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    username: user?.name || '',
    userContact: '',
    userMessage: ''
  });

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data } = await propertyAPI.getById(id);
      setProperty(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await bookingAPI.create({ ...bookingData, propertyId: id });
      alert('Booking request sent successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send booking request');
    }
  };

  if (!property) return <div>Loading...</div>;

  return (
    <div className="row">
      <div className="col-md-8">
        <div className="card">
          <div className="card-body">
            <h2>{property.propType}</h2>
            <p className="text-muted">{property.propAddress}</p>
            <h3 className="text-primary">${property.propAmt}/month</h3>
            
            <hr />
            
            <h5>Property Details</h5>
            <ul>
              <li>Type: {property.propType}</li>
              <li>Bedrooms: {property.bedrooms || 'N/A'}</li>
              <li>Available: {property.isAvailable ? 'Yes' : 'No'}</li>
            </ul>

            {property.addInfo && (
              <>
                <h5>Additional Information</h5>
                <p>{property.addInfo}</p>
              </>
            )}

            <h5>Owner Contact</h5>
            <p>{property.ownerContact}</p>
            <p>Email: {property.userId?.email}</p>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h5>Interested in this property?</h5>
            {!showBookingForm ? (
              <button 
                className="btn btn-primary w-100"
                onClick={() => setShowBookingForm(true)}
              >
                Send Inquiry
              </button>
            ) : (
              <form onSubmit={handleBooking}>
                <div className="mb-3">
                  <label className="form-label">Your Name</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={bookingData.username}
                    onChange={(e) => setBookingData({...bookingData, username: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contact Number</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={bookingData.userContact}
                    onChange={(e) => setBookingData({...bookingData, userContact: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea 
                    className="form-control"
                    value={bookingData.userMessage}
                    onChange={(e) => setBookingData({...bookingData, userMessage: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Send Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
