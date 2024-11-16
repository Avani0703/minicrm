import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header'; // Import the Header component

const Audience = () => {
  const [conditions, setConditions] = useState([{ field: 'spending', operator: '>', value: 10000 }]);
  const [logic, setLogic] = useState('AND');
  const [audienceSize, setAudienceSize] = useState(null);
  const [data, setData] = useState([]); // Data from the server will be stored here

  const navigate = useNavigate();

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
    conditionRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    },
    select: {
      padding: '8px',
      marginRight: '8px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      width: '100px',
    },
    input: {
      padding: '8px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      width: '100px',
    },
    addConditionButton: {
      padding: '10px 15px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '10px',
      marginBottom: '20px',
    },
    calculateButton: {
      padding: '10px 15px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '20px',
      width: '100%',
      fontSize: '16px',
      fontWeight: 'bold',
    },
    audienceSize: {
      textAlign: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#007bff',
      marginTop: '20px',
    },
    campaignButton: {
      padding: '10px 15px',
      backgroundColor: '#17a2b8',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '20px',
      width: '100%',
      fontSize: '16px',
    },
  };

  const handleAddCondition = () => {
    setConditions([...conditions, { field: 'spending', operator: '>', value: 10000 }]);
  };

  const handleConditionChange = (index, key, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index][key] = value;
    setConditions(updatedConditions);
  };

  const handleCalculateAudienceSize = async () => {
    try {
      // Assign the response to a variable
      const response = await axios.post('http://localhost:3001/audience-size', { conditions, logic });
      
      // Access response data
      setData(response.data);  // Store filtered data in state (optional if you need to use it later)
      setAudienceSize(response.data.length);  // Set the audience size based on filtered data
    } catch (error) {
      console.error("Error fetching filtered audience:", error.response || error.message);
    }
  };
  

  const handleNavigateToStats = () => {
    if (data.length > 0) {
      navigate('/campaign-history', { state: { audience: data } });
    } else {
      alert('Please calculate audience size before proceeding.');
    }
  };

  return (
    <div>
      {/* Add Header */}
      <Header />

      <div style={styles.container}>
        <h2 style={styles.heading}>Define Your Audience Segment</h2>
        
        {conditions.map((condition, index) => (
          <div key={index} style={styles.conditionRow}>
            <select
              value={condition.field}
              onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
              style={styles.select}
            >
              <option value="spending">Spending</option>
              <option value="lastVisit">Last Visit</option>
            </select>
            
            <select
              value={condition.operator}
              onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
              style={styles.select}
            >
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
            </select>
            
            <input
              type="number"
              value={condition.value}
              onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
              style={styles.input}
            />
          </div>
        ))}
        
        <button onClick={handleAddCondition} style={styles.addConditionButton}>Add Condition</button>

        <div>
          <label>
            Combine Conditions with:
            <select value={logic} onChange={(e) => setLogic(e.target.value)} style={styles.select}>
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          </label>
        </div>

        <button onClick={handleCalculateAudienceSize} style={styles.calculateButton}>
          Calculate Audience Size
        </button>

        {audienceSize !== null && (
          <div style={styles.audienceSize}>Audience Size: {audienceSize}</div>
        )}

        <button onClick={handleNavigateToStats} style={styles.campaignButton}>
          Go to Campaign History & Stats
        </button>
      </div>
    </div>
  );
};

export default Audience;
