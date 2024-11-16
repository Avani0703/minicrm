import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header'; // Import the Header component

const Message = () => {
  const [filterAmount, setFilterAmount] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [filteredAudiences, setFilteredAudiences] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  // Function to filter audiences based on spending amount
  const filterAudiences = async () => {
    if (filterAmount === '') {
      setStatusMessage('Please enter an amount to filter.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/filter-audiences', { filterAmount });
      setFilteredAudiences(response.data.filteredAudiences);
      setStatusMessage(`${response.data.filteredAudiences.length} audience(s) found.`);
    } catch (error) {
      setStatusMessage('Error filtering audiences.');
    }
  };

  // Function to send messages to filtered audiences
  const sendMessages = async () => {
    if (filterAmount === '' || messageTemplate === '') {
      setStatusMessage('Please fill out all fields.');
      return;
    }
  
    console.log("Sending message with filterAmount:", filterAmount, "and messageTemplate:", messageTemplate);
  
    try {
      const response = await axios.post('http://localhost:3001/send-messages', { 
        filterAmount: parseInt(filterAmount),
        messageTemplate
      });
      console.log('Response from server:', response);  // Log the server's response
      setStatusMessage(response.data.message);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatusMessage('Error sending messages');
    }
  };
  
  
  
  return (
    <div>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.heading}>Send Personalized Messages</h2>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Filter audiences with spending greater than:
            <input 
              style={styles.input} 
              type="number" 
              value={filterAmount} 
              onChange={e => setFilterAmount(e.target.value)} 
              placeholder="Enter amount"
            />
          </label>
          <button style={styles.button} onClick={filterAudiences}>Filter</button>
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Message Template:
            <textarea 
              style={styles.textarea} 
              value={messageTemplate} 
              onChange={e => setMessageTemplate(e.target.value)} 
              placeholder="Hi [Name], here’s 10% off on your next order! You have spent a total of $[Total]."
              rows="4"
              cols="50"
            />
          </label>
        </div>
        
        <button style={styles.button} onClick={sendMessages} disabled={filteredAudiences.length === 0}>
          Send Messages
        </button>
        
        {statusMessage && <div style={styles.statusMessage}>{statusMessage}</div>}

        {/* Display filtered audiences */}
        {filteredAudiences.length > 0 && (
          <div>
            <h3 style={styles.subHeading}>Filtered Audiences:</h3>
            <ul style={styles.audienceList}>
              {filteredAudiences.map(audience => (
                <li key={audience._id} style={styles.audienceItem}>
                  {audience.name} - Total Spending: ${audience.totalSpending}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '10px',
    width: '100%',
  },
  textarea: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  statusMessage: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#007BFF',
    fontWeight: 'bold',
    marginTop: '20px',
  },
  subHeading: {
    color: '#555',
    marginTop: '30px',
  },
  audienceList: {
    listStyleType: 'none',
    padding: 0,
  },
  audienceItem: {
    padding: '10px',
    backgroundColor: '#f1f1f1',
    marginBottom: '10px',
    borderRadius: '4px',
  },
};

export default Message;

