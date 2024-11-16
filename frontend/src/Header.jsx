// Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
    },
    button: {
      backgroundColor: '#ffffff',
      color: '#007bff',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={() => navigate('/home')}>
        Go To Home
      </button>
    </div>
  );
};

export default Header;
