import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

export default function ViewEvents() {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${config.url}/viewevents`);
      if (response.data.length === 0) {
        setMessage('No events found');
        setEvents([]);
      } else {
        setEvents(response.data);
      }
    } catch (error) {
      setMessage('Failed to fetch events');
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '30px',
    marginTop: '30px'
  };

  const cardStyle = {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(15, 22, 41, 0.9) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'cardSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) backwards',
    overflow: 'hidden'
  };

  const cardHoverStyle = {
    transform: 'translateY(-10px)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
    boxShadow: '0 25px 60px rgba(59, 130, 246, 0.3)'
  };

  const imageContainerStyle = {
    width: '100%',
    height: '220px',
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 22, 41, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease'
  };

  const noImageStyle = {
    fontSize: '4rem',
    color: '#94a3b8'
  };

  const contentStyle = {
    padding: '25px'
  };

  const categoryStyle = {
    display: 'inline-block',
    padding: '6px 16px',
    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    color: 'white',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '15px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const titleEventStyle = {
    color: '#3b82f6',
    fontSize: '1.6rem',
    fontWeight: '700',
    marginBottom: '15px',
    lineHeight: '1.3'
  };

  const descriptionStyle = {
    color: '#94a3b8',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '20px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
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

  const iconStyle = {
    marginRight: '10px',
    fontSize: '1.2rem'
  };

  const labelStyle = {
    color: '#94a3b8',
    fontWeight: '600',
    marginRight: '8px'
  };

  const valueStyle = {
    color: '#e0e6ed',
    flex: 1
  };

  const messageStyle = {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '1.2rem',
    marginTop: '50px'
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Events</h2>

      {events.length > 0 ? (
        <div style={gridStyle}>
          {events.map((event, index) => (
            <div
              key={event._id}
              style={{
                ...cardStyle,
                ...(hoveredCard === index ? cardHoverStyle : {}),
                animationDelay: `${index * 0.1}s`
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={imageContainerStyle}>
                {event.file ? (
                  <img
                    src={`${config.url}/eventimage/${event.file}`}
                    alt={event.title}
                    style={{
                      ...imageStyle,
                      transform: hoveredCard === index ? 'scale(1.1)' : 'scale(1)'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = '<div style="font-size: 4rem; color: #94a3b8;">📅</div>';
                    }}
                  />
                ) : (
                  <div style={noImageStyle}>📅</div>
                )}
              </div>

              <div style={contentStyle}>
                <span style={categoryStyle}>{event.category}</span>

                <h3 style={titleEventStyle}>{event.title}</h3>

                <p style={descriptionStyle}>{event.description}</p>

                <div style={detailsStyle}>
                  <div style={detailItemStyle}>
                    <span style={iconStyle}>📅</span>
                    <span style={labelStyle}>Date:</span>
                    <span style={valueStyle}>{formatDate(event.date)}</span>
                  </div>

                  <div style={detailItemStyle}>
                    <span style={iconStyle}>📍</span>
                    <span style={labelStyle}>Location:</span>
                    <span style={valueStyle}>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={messageStyle}>{message || 'Loading events...'}</p>
      )}
    </div>
  );
}