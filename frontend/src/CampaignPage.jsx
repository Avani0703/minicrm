// CampaignPage.jsx
import React, { useEffect, useState } from 'react';

const CampaignPage = () => {
  const [audienceSize, setAudienceSize] = useState(0);
  const [numberSent, setNumberSent] = useState(0);
  const [numberFailed, setNumberFailed] = useState(0);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Fetch unique audiences
        const audienceResponse = await fetch('http://localhost:3001/audiences');
        const audiences = await audienceResponse.json();

        // Set unique audience size
        const uniqueAudiences = new Set(audiences.map(a => a.name));
        setAudienceSize(uniqueAudiences.size);

        // Fetch communication logs
        const logResponse = await fetch('http://localhost:3001/communication-logs');
        const logs = await logResponse.json();

        // Count number sent and failed
        setNumberSent(logs.filter(log => log.status === 'SENT').length);
        setNumberFailed(logs.filter(log => log.status === 'FAILED').length);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="campaign-page">
      <style>
        {`
          .campaign-page {
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .campaign-page h1 {
            text-align: center;
            color: #333;
          }

          .statistics {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
          }

          .stat-item {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
            width: 30%;
            text-align: center;
          }

          .stat-item h2 {
            color: #666;
          }

          .stat-item p {
            font-size: 24px;
            color: #333;
            margin: 0;
          }
        `}
      </style>
      <h1>Campaign Statistics</h1>
      <div className="statistics">
        <div className="stat-item">
          <h2>Audience Size</h2>
          <p>{audienceSize}</p>
        </div>
        <div className="stat-item">
          <h2>Number Sent</h2>
          <p>{numberSent}</p>
        </div>
        <div className="stat-item">
          <h2>Number Failed</h2>
          <p>{numberFailed}</p>
        </div>
      </div>
    </div>
  );
};

export default CampaignPage;
