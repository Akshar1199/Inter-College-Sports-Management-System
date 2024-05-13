import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import '../styles/request.css';

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/admin/getrequests', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => setRequests(data))
      .catch(error => console.error('Error fetching requests:', error));
  }, []);

  const handleAccept = (requestId) => {
    fetch(`http://localhost:5000/admin/acceptRequest/${requestId}`, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Request accepted:', data);
        window.location.reload();
      })
      .catch(error => console.error('Error accepting request:', error));
  };

  const handleDecline = (requestId) => {
    fetch(`http://localhost:5000/admin/declineRequest/${requestId}`, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Request declined:', data);
        window.location.reload();
      })
      .catch(error => console.error('Error declining request:', error));
  };

  return (
    <>
      <AdminNavbar />
      <div className="requests-container">

        <h1>Requests</h1>
        {requests.map(request => (
          <div key={request._id} className="request-card">
            <div className="request-details">
              <p><strong>Username:</strong> {request.username}</p>
              <p><strong>College Name:</strong> {request.clg_name}</p>
              <p><strong>City:</strong> {request.city}</p>
              <p><strong>Email:</strong> {request.email}</p>
              <p><strong>Mobile Number:</strong> {request.mobile_no}</p>
            </div>
            <div className="request-actions">
              <button className="accept-btn" onClick={() => handleAccept(request._id)}>Accept</button>
              <button className="decline-btn" onClick={() => handleDecline(request._id)}>Decline</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Requests;
