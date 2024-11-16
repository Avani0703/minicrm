import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; // Assuming the Header component is in the same directory

const AddAudience = () => {
  const [audienceData, setAudienceData] = useState({
    name: '',
    lastVisit: '',
    spending: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAudienceData({
      ...audienceData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/add-audience', {
        name: audienceData.name,
        lastVisit: audienceData.lastVisit,
        spending: audienceData.spending,
      });
      alert('Audience data submitted successfully!');
    } catch (error) {
      console.error('Error saving audience data:', error);
      alert('Failed to save audience data.');
    }
  };

  return (
    <div>
      {/* Add Header */}
      <Header />

      {/* Main Content */}
      <div style={styles.container}>
        <h2 style={styles.heading}>Add Audience Data</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputRow}>
            <label style={styles.label}>User's Name:</label>
            <input
              type="text"
              name="name"
              value={audienceData.name}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputRow}>
            <label style={styles.label}>Visit Date:</label>
            <div style={styles.dateWrapper}>
              <input
                type="date"
                name="lastVisit"
                value={audienceData.lastVisit}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputRow}>
            <label style={styles.label}>Total Spending:</label>
            <input
              type="number"
              name="spending"
              value={audienceData.spending}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            Submit Audience Data
          </button>
        </form>
      </div>
    </div>
  );
};

// Styling for the component
const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: '26px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputRow: {
    marginBottom: '20px',
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#333',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    fontSize: '14px',
    color: '#333',
    marginTop: '5px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  },
  dateWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  submitButton: {
    padding: '12px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
};

export default AddAudience;
