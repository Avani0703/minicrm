const express = require('express');
const Audience = require('../models/Audience'); // Import Audience model
const router = express.Router();

// Endpoint to fetch audience data with calculated visits
router.post('/audience-size', async (req, res) => {
  try {
    const { conditions, logic } = req.body; // Extract conditions from request body

    // Build the query dynamically based on conditions
    let query = {};

    conditions.forEach(condition => {
      if (condition.field === 'spending') {
        query.spending = { [`$${condition.operator}`]: condition.value };
      } else if (condition.field === 'visits') {
        query.visits = { [`$${condition.operator}`]: condition.value };
      } else if (condition.field === 'lastVisit') {
        const date = new Date(condition.value);
        query.lastVisit = { [`$${condition.operator}`]: date };
      }
    });

    // MongoDB aggregation to calculate the total number of visits
    const audienceData = await Audience.aggregate([
      { $match: query }, // Match the conditions dynamically
      {
        $group: {
          _id: null, // Group by null to calculate over all records
          totalVisits: { $sum: "$visits" }, // Sum of all visits
        }
      }
    ]);

    // Send the result back to the frontend
    const totalVisits = audienceData.length > 0 ? audienceData[0].totalVisits : 0;
    res.json({ totalVisits });
  } catch (error) {
    console.error('Error fetching audience data:', error);
    res.status(500).json({ message: 'Error fetching audience data' });
  }
});

module.exports = router;
