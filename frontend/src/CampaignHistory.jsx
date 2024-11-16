import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './Header'; // Import the Header component

const CampaignHistory = () => {
  const [campaignLogs, setCampaignLogs] = useState([]);
  const location = useLocation();
  const { state } = location || {};
  const filteredAudience = state?.audience || []; // Pass filtered audience via navigate

  useEffect(() => {
    const fetchCampaignHistory = async () => {
      try {
        const response = await axios.post('http://localhost:3001/campaign-history', {
          filteredAudienceIds: filteredAudience.map((aud) => aud._id),
        });
        setCampaignLogs(response.data);
      } catch (error) {
        console.error('Error fetching campaign history:', error);
      }
    };

    if (filteredAudience.length > 0) {
      fetchCampaignHistory();
    }
  }, [filteredAudience]);

  if (campaignLogs.length === 0) {
    return <p style={styles.noHistory}>No campaign history available for this audience.</p>;
  }

  return (
    <div style={styles.container}>
      <Header /> {/* Add the Header component here */}
      <h2 style={styles.title}>Campaign History</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Audience Name</th>
            <th style={styles.th}>Message</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Date</th>
          </tr>
        </thead>
        <tbody>
          {campaignLogs.map((log) => (
            <tr key={log._id} style={styles.tr}>
              <td style={styles.td}>{log.name}</td>
              <td style={styles.td}>{log.message}</td>
              <td style={{ ...styles.td, ...styles.status[log.status.toLowerCase()] }}>
                {log.status}
              </td>
              <td style={styles.td}>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  th: {
    border: '1px solid #ccc',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '14px',
  },
  td: {
    border: '1px solid #ccc',
    padding: '12px',
    fontSize: '14px',
    color: '#555',
  },
  tr: {
    backgroundColor: '#ffffff',
  },
  noHistory: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#6c757d',
    marginTop: '20px',
  },
  status: {
    sent: {
      color: '#28a745',
      fontWeight: 'bold',
    },
    failed: {
      color: '#dc3545',
      fontWeight: 'bold',
    },
    pending: {
      color: '#ffc107',
      fontWeight: 'bold',
    },
  },
};

export default CampaignHistory;
