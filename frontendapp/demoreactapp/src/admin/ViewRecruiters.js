import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

export default function ViewRecruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [message, setMessage] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const response = await axios.get(`${config.url}/viewrecruiters`);
      if (response.data === 'DATA NOT FOUND') {
        setMessage('No recruiters found');
        setRecruiters([]);
      } else {
        setRecruiters(response.data);
      }
    } catch (error) {
      setMessage('Failed to fetch recruiters');
    }
  };

  const handleDelete = async (username) => {
    if (window.confirm(`Are you sure you want to delete recruiter: ${username}?`)) {
      try {
        const response = await axios.delete(`${config.url}/deleterecruiter/${username}`);
        alert(response.data);
        fetchRecruiters();
      } catch (error) {
        alert('Failed to delete recruiter');
      }
    }
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
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    margin: '0 auto 20px',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
  };

  const nameStyle = {
    color: '#3b82f6',
    fontSize: '1.5rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '10px'
  };

  const companyStyle = {
    color: '#10b981',
    fontSize: '1.1rem',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: '20px'
  };

  const detailsStyle = {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(59, 130, 246, 0.2)'
  };

  const detailItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '12px',
    fontSize: '0.95rem'
  };

  const labelStyle = {
    color: '#94a3b8',
    fontWeight: '600',
    minWidth: '100px',
    marginRight: '10px'
  };

  const valueStyle = {
    color: '#e0e6ed',
    flex: 1,
    wordBreak: 'break-word'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
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

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Recruiters</h2>

      {recruiters.length > 0 ? (
        <div style={gridStyle}>
          {recruiters.map((recruiter, index) => (
            <div
              key={recruiter._id}
              style={{
                ...cardStyle,
                ...(hoveredCard === index ? cardHoverStyle : {}),
                animationDelay: `${index * 0.1}s`
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={iconStyle}>🏢</div>

              <h3 style={nameStyle}>{recruiter.fullname}</h3>
              <p style={companyStyle}>{recruiter.company}</p>

              <div style={detailsStyle}>
                <div style={detailItemStyle}>
                  <span style={labelStyle}>Username:</span>
                  <span style={valueStyle}>{recruiter.username}</span>
                </div>

                <div style={detailItemStyle}>
                  <span style={labelStyle}>Email:</span>
                  <span style={valueStyle}>{recruiter.email}</span>
                </div>

                <div style={detailItemStyle}>
                  <span style={labelStyle}>Gender:</span>
                  <span style={valueStyle}>{recruiter.gender}</span>
                </div>

                <div style={detailItemStyle}>
                  <span style={labelStyle}>DOB:</span>
                  <span style={valueStyle}>{recruiter.dateofbirth}</span>
                </div>

                <div style={detailItemStyle}>
                  <span style={labelStyle}>Contact:</span>
                  <span style={valueStyle}>{recruiter.contact}</span>
                </div>

                <div style={detailItemStyle}>
                  <span style={labelStyle}>Address:</span>
                  <span style={valueStyle}>{recruiter.address}</span>
                </div>
              </div>

              <div style={buttonContainerStyle}>
                <button
                  style={deleteButtonStyle}
                  onClick={() => handleDelete(recruiter.username)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Delete Recruiter
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={messageStyle}>{message || 'Loading recruiters...'}</p>
      )}
    </div>
  );
}