import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

export default function AddRecruiter() {
  const [formData, setFormData] = useState({
    fullname: '',
    gender: '',
    dateofbirth: '',
    company: '',
    username: '',
    email: '',
    password: 'klef1234', // Default password
    address: '',
    contact: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newValue = id === 'fullname' ? value.toUpperCase() : value;
    setFormData({ ...formData, [id]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setShowCredentials(false);

    try {
      const response = await axios.post(`${config.url}/addrecruiter`, formData);

      if (response.status === 200) {
        setMessage(response.data);
        setShowCredentials(true);

        // Don't reset form immediately so admin can copy credentials
        setTimeout(() => {
          setFormData({
            fullname: '',
            gender: '',
            dateofbirth: '',
            company: '',
            username: '',
            email: '',
            password: 'klef1234',
            address: '',
            contact: ''
          });
        }, 10000); // Reset after 10 seconds
      }
    } catch (error) {
      setError(error.response?.data || 'Failed to add recruiter. Username, email, or contact may already exist.');
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Add Recruiter</h2>

      {message && (
        <div style={{
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid #10b981',
          borderRadius: '12px',
          color: '#10b981',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '15px' }}>{message}</h3>
          {showCredentials && (
            <div style={{
              marginTop: '15px',
              padding: '15px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '8px'
            }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                <strong>Share these credentials with the recruiter:</strong>
              </p>
              <p style={{ fontSize: '1.2rem', margin: '5px 0' }}>
                <strong>Username:</strong> {formData.username}
              </p>
              <p style={{ fontSize: '1.2rem', margin: '5px 0' }}>
                <strong>Password:</strong> {formData.password}
              </p>
              <p style={{ fontSize: '0.9rem', marginTop: '10px', color: '#94a3b8' }}>
                (Form will reset in 10 seconds)
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '2px solid #ef4444',
          borderRadius: '12px',
          color: '#ef4444',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input
          type="text"
          id="fullname"
          value={formData.fullname}
          onChange={handleChange}
          required
        />

        <label>Gender</label>
        <select
          id="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </select>

        <label>Date of Birth</label>
        <input
          type="date"
          id="dateofbirth"
          value={formData.dateofbirth}
          onChange={handleChange}
          required
        />

        <label>Company Name</label>
        <input
          type="text"
          id="company"
          value={formData.company}
          onChange={handleChange}
          required
          placeholder="e.g., Acme Corporation"
        />

        <label>Username</label>
        <input
          type="text"
          id="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="e.g., acme_hr (recruiter will use this to login)"
        />

        <label>Email</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="recruiter@company.com"
        />

        <label>Password</label>
        <input
          type="text"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Default: klef1234 (or set custom password)"
        />

        <label>Address</label>
        <textarea
          id="address"
          value={formData.address}
          onChange={handleChange}
          required
          rows="3"
          placeholder="Company address"
        />

        <label>Contact Number</label>
        <input
          type="text"
          id="contact"
          value={formData.contact}
          onChange={handleChange}
          required
          placeholder="+1234567890"
        />

        <button type="submit">Add Recruiter</button>
      </form>
    </div>
  );
}