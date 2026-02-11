import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';

export default function ViewJobSeekers() {
  const [jobseekers, setJobSeekers] = useState([]);
  const [message, setMessage] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobSeekers();
  }, []);

  const fetchJobSeekers = async () => {
    try {
      const response = await axios.get(`${config.url}/viewjobseekers`);
      if (response.data === 'DATA NOT FOUND') {
        setMessage('No job seekers found');
        setJobSeekers([]);
      } else {
        setJobSeekers(response.data);
      }
    } catch (error) {
      setMessage('Failed to fetch job seekers');
    }
  };

  const handleDelete = async (email) => {
    if (window.confirm(`Are you sure you want to delete job seeker: ${email}?`)) {
      try {
        const response = await axios.delete(`${config.url}/deletejobseeker/${email}`);
        alert(response.data);
        fetchJobSeekers();
      } catch (error) {
        alert('Failed to delete job seeker');
      }
    }
  };

  const handleView = (email) => {
    navigate(`/viewjobseekerprofile/${email}`);
  };

  const containerStyle = {
    padding: '40px 20px',
    maxWidth: '1400px',
    margin: '0 auto'
  };

  const titleStyle = {
    textAlign: 'center',
    color: '#e0e6ed',
    fontSize: '2.5rem',
    marginBottom: '40px',
    animation: 'fadeInDown 0.6s ease-out'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '30px',
    marginTop: '30px'
  };

  const cardStyle = {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(15, 22, 41, 0.9) 100%)',
    backdropFilter: 'blur(10px)',
    padding: '30px',
    borderRadius: '20px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'cardSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) backwards'
  };

  const cardHoverStyle = {
    transform: 'translateY(-10px)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
    boxShadow: '0 25px 60px rgba(59, 130, 246, 0.3)'
  };

  const iconStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    margin: '0 auto 20px',
    boxShadow: '0 8px 20px rgba(6, 182, 212, 0.4)'
  };

  const nameStyle = {
    color: '#06b6d4',
    fontSize: '1.5rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '10px'
  };

  const emailStyle = {
    color: '#94a3b8',
    fontSize: '0.95rem',
    textAlign: 'center',
    marginBottom: '20px',
    wordBreak: 'break-word'
  };

  const detailsStyle = {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(59, 130, 246, 0.2)'
  };

  const detailItemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    fontSize: '0.95rem'
  };

  const labelStyle = {
    color: '#94a3b8',
    fontWeight: '600',
    minWidth: '80px',
    marginRight: '10px'
  };

  const valueStyle = {
    color: '#e0e6ed',
    flex: 1
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  };

  const viewButtonStyle = {
    flex: 1,
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontSize: '0.95rem'
  };

  const deleteButtonStyle = {
    flex: 1,
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontSize: '0.95rem'
  };

  const messageStyle = {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '1.2rem',
    marginTop: '50px'
  };

  const getGenderIcon = (gender) => {
    if (gender === 'male') return '👨';
    if (gender === 'female') return '👩';
    return '👤';
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Job Seekers</h2>

      {jobseekers.length > 0 ? (
        <div style={gridStyle}>
          {jobseekers.map((jobseeker, index) => (
            <div
              key={jobseeker._id}
              style={{
                ...cardStyle,
                ...(hoveredCard === index ? cardHoverStyle : {}),
                animationDelay: `${index * 0.1}s`
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={iconStyle}>
                {getGenderIcon(jobseeker.gender)}
              </div>

              <h3 style={nameStyle}>{jobseeker.fullname}</h3>
              <p style={emailStyle}>{jobseeker.email}</p>

              <div style={detailsStyle}>
                <div style={detailItemStyle}>
                  <span style={labelStyle}>Gender:</span>
                  <span style={valueStyle}>{jobseeker.gender}</span>
                </div>

                <div style={detailItemStyle}>
                  <span style={labelStyle}>DOB:</span>
                  <span style={valueStyle}>{jobseeker.dateofbirth}</span>
                </div>

                <div style={detailItemStyle}>
                  <span style={labelStyle}>Location:</span>
                  <span style={valueStyle}>{jobseeker.location}</span>
                </div>

                <div style={detailItemStyle}>
                  <span style={labelStyle}>Contact:</span>
                  <span style={valueStyle}>{jobseeker.contact}</span>
                </div>
              </div>

              <div style={buttonContainerStyle}>
                <button
                  style={viewButtonStyle}
                  onClick={() => handleView(jobseeker.email)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  View Profile
                </button>
                <button
                  style={deleteButtonStyle}
                  onClick={() => handleDelete(jobseeker.email)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={messageStyle}>{message || 'Loading job seekers...'}</p>
      )}
    </div>
  );
}