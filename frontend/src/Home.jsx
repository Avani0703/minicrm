import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: 'Arial, sans-serif',
      position: 'relative', // This is needed to position the logout button
    },
    heading: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '30px',
      color: '#333',
      animation: 'flash 1.5s infinite',
    },
    boxContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      width: '100%',
      maxWidth: '1000px',
      flexWrap: 'wrap', // Allow boxes to wrap to the next line if needed
    },
    box: {
      width: '300px',
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      textAlign: 'center',
      fontSize: '18px',
      fontWeight: 'bold',
      textDecoration: 'none',
      transition: 'transform 0.3s, filter 0.3s',
      cursor: 'pointer',
      margin: '10px',
    },
    audienceBox: {
      backgroundColor: '#007bff',
    },
    messageBox: {
      backgroundColor: '#28a745',
    },
    addAudienceBox: {
      backgroundColor: '#f39c12', // New color for the Add Audience box
    },
    hover: {
      transform: 'scale(1.05)',
      filter: 'brightness(0.85)',
    },
    logoutButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      borderRadius: '5px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    }
  };

  const [hoveredBox, setHoveredBox] = React.useState(null);

  // Handle logout and redirect to login page
  const handleLogout = () => {
    // Clear session data (you can use localStorage or sessionStorage)
    localStorage.removeItem('user');
    
    // Navigate to login page and display a success message
    navigate('/login', { state: { message: 'User logged out successfully!' } });
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes flash {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }
        `}
      </style>

      {/* Logout Button */}
      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>

      <h1 style={styles.heading}>Welcome to Mini-CRM</h1>
      <div style={styles.boxContainer}>
        {/* Audience Size Box */}
        <Link
          to="/audience-size"
          style={{
            ...styles.box,
            ...styles.audienceBox,
            ...(hoveredBox === 'audience' ? styles.hover : {}),
          }}
          onMouseEnter={() => setHoveredBox('audience')}
          onMouseLeave={() => setHoveredBox(null)}
        >
          Calculate Audience Size
        </Link>

        {/* Message Sending Box */}
        <Link
          to="/send-messages"
          style={{
            ...styles.box,
            ...styles.messageBox,
            ...(hoveredBox === 'message' ? styles.hover : {}),
          }}
          onMouseEnter={() => setHoveredBox('message')}
          onMouseLeave={() => setHoveredBox(null)}
        >
          Message Sending
        </Link>

        {/* Add Audience Data Box */}
        <Link
          to="/add-audience"
          style={{
            ...styles.box,
            ...styles.addAudienceBox,
            ...(hoveredBox === 'addAudience' ? styles.hover : {}),
          }}
          onMouseEnter={() => setHoveredBox('addAudience')}
          onMouseLeave={() => setHoveredBox(null)}
        >
          Add Audience Data
        </Link>
      </div>
    </div>
  );
};

export default Home;
