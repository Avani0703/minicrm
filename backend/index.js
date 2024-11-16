const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require('./models/users');
const Audience = require('./models/Audience');
const audienceRoute = require('./routes/audience');
const CommunicationLog = require('./models/communicationLog');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());



// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/mini-crm");



app.post('/login', (req, res) => {
    const { email, password } = req.body; 
    EmployeeModel.findOne({ email: email })
    .then(user => {
        if (user) {
            if (user.password === password) {
                res.status(200).json("Success");
            } else {
                res.status(401).json("Password is Incorrect"); // Unauthorized status
            }
        } else {
            res.status(404).json("No Record Existed"); // Not found status
        }
    })
    .catch(error => {
        res.status(500).json("Server Error"); // Internal server error status
    });
});





app.post('/add-audience', async (req, res) => {
    try {
      const { name, lastVisit, spending } = req.body;
      const audience = new Audience({ name, lastVisit, spending });
      await audience.save();
      res.status(201).json({ message: 'Audience data saved successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error saving data', error });
    }
  });
  

  app.post('/filter-audiences', async (req, res) => {
    try {
      const { filterAmount } = req.body;
  
      console.log('Received filterAmount:', filterAmount); // Debugging log
  
      // Ensure filterAmount is a number
      const numericFilterAmount = Number(filterAmount);
  
      const audiences = await Audience.aggregate([
        {
          $group: {
            _id: "$name",
            totalSpending: { $sum: "$spending" },
            lastVisit: { $max: "$lastVisit" }
          }
        },
        {
          $match: {
            totalSpending: { $gt: numericFilterAmount }
          }
        }
      ]);
  
      console.log('Filtered audiences:', audiences); // Debugging log
  
      const filteredAudiences = audiences.map(audience => ({
        name: audience._id,
        totalSpending: audience.totalSpending,
        lastVisit: audience.lastVisit,
      }));
  
      res.status(200).json({ filteredAudiences });
    } catch (error) {
      console.error('Error filtering audiences:', error);
      res.status(500).json({ message: 'Error filtering audiences' });
    }
  });
  
  



  app.post('/send-messages', async (req, res) => {
    try {
      const { filterAmount, messageTemplate } = req.body;
  
      if (!filterAmount || !messageTemplate) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      console.log('Filter Amount:', filterAmount);
      console.log('Message Template:', messageTemplate);
  
      // 1. Calculate total spending for each audience
      const audiences = await Audience.find();
  
      // 2. Filter audiences based on individual total spending greater than filterAmount
      const filteredAudiences = audiences.filter(audience => audience.spending > filterAmount);
  
      if (filteredAudiences.length === 0) {
        return res.status(404).json({ message: 'No audiences match the filter' });
      }
  
      console.log('Filtered Audiences:', filteredAudiences); // Log filtered audiences for debugging
  
      // 3. Send personalized messages to each filtered audience based on their individual total spending
      const communicationLogs = filteredAudiences.map(async (audience) => {
        try {
          const totalSpending = audience.spending;
  
          // 4. Create the personalized message
          const personalizedMessage = messageTemplate
            .replace('[Name]', audience.name)
            .replace('[Total]', totalSpending);
  
          console.log(`Personalized Message for ${audience.name}:`, personalizedMessage);
  
          // 5. Save the message in the communication log
          const newLog = new CommunicationLog({
            audienceId: audience._id,
            name: audience.name,
            spending: totalSpending,
            message: personalizedMessage,
            status: 'PENDING', // Set to 'PENDING' initially
          });
  
          await newLog.save();
          console.log('Message saved in Communication Log:', newLog);
  
          // 6. Simulate message delivery
          const isDelivered = Math.random() < 0.9; // 90% chance to be SENT, 10% chance to be FAILED
          const status = isDelivered ? 'SENT' : 'FAILED';
  
          // 7. Update the communication log with delivery status
          await CommunicationLog.findByIdAndUpdate(newLog._id, { status });
          console.log(`Message status for ${audience.name} updated to ${status}`);
  
        } catch (error) {
          console.error(`Error processing message for ${audience.name}:`, error);
        }
      });
  
      // Wait for all messages to be processed and logs to be saved
      await Promise.all(communicationLogs);
  
      res.status(200).json({ message: 'Messages sent successfully!' });
    } catch (error) {
      console.error('Error sending messages:', error); // More detailed error logging
      res.status(500).json({ message: 'Error sending messages', error: error.message });
    }
});

  
  // app.post('/send-messages', async (req, res) => {
  //   try {
  //     const { filterAmount, messageTemplate } = req.body;
  
  //     // Ensure filterAmount is a valid number
  //     const numericFilterAmount = Number(filterAmount);
  //     if (isNaN(numericFilterAmount)) {
  //       return res.status(400).json({ message: 'Invalid filterAmount' });
  //     }
  
  //     // Get filtered audiences based on the filterAmount
  //     const audiences = await Audience.aggregate([
  //       {
  //         $group: {
  //           _id: "$name",
  //           totalSpending: { $sum: "$spending" },
  //           lastVisit: { $max: "$lastVisit" }
  //         }
  //       },
  //       {
  //         $match: {
  //           totalSpending: { $gt: numericFilterAmount }
  //         }
  //       }
  //     ]);
  
  //     if (audiences.length === 0) {
  //       return res.status(404).json({ message: 'No audiences found matching the filter criteria' });
  //     }
  
  //     // Prepare promises for saving communication logs
  //     const communicationLogPromises = audiences.map(async (audience) => {
  //       try {
  //         const personalizedMessage = messageTemplate
  //           .replace('[Name]', audience._id)
  //           .replace('[Total]', audience.totalSpending);
  
  //         // Check if audience._id is a valid ObjectId string
  //         let audienceId;
  //         if (mongoose.Types.ObjectId.isValid(audience._id)) {
  //           audienceId = new mongoose.Types.ObjectId(audience._id);
  //         } else {
  //           audienceId = audience._id; // Keep it as string if not valid
  //         }
  
  //         const log = await CommunicationLog.create({
  //           audienceId: audienceId,  // Store as ObjectId or string
  //           name: audience._id,
  //           spending: audience.totalSpending,
  //           message: personalizedMessage,
  //           status: 'SENT',
  //           createdAt: new Date(),
  //         });
  
  //         console.log(`Message sent to ${audience._id}: ${personalizedMessage}`);
  //         return log;
  //       } catch (error) {
  //         console.error('Error creating communication log:', error);
  //         return null;  // Continue processing other messages
  //       }
  //     });
  
  //     // Await all promises
  //     const logs = await Promise.all(communicationLogPromises);
  
  //     res.status(200).json({
  //       message: `${audiences.length} message(s) sent successfully.`,
  //       logs: logs.filter(log => log !== null), // Optionally filter out null logs
  //     });
  
  //   } catch (error) {
  //     console.error('Error sending messages:', error.message);
  //     console.error(error.stack); // Full stack trace
  //     res.status(500).json({ message: 'Error sending messages', error: error.message });
  //   }
  // });



  app.post('/audience-size', (req, res) => {
    console.log("Received audience-size request:", req.body); // Add this log
    const { conditions, logic } = req.body;
  
    const filters = conditions.map(condition => {
      const { field, operator, value } = condition;
      if (field === 'spending') {
        return { spending: { [operator === '>' ? '$gt' : '$lte']: value } };
      } else if (field === 'lastVisit') {
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - value);
        return { lastVisit: { [operator === '>' ? '$lt' : '$gte']: cutoffDate } };
      }
    });
  
    const query = logic === 'AND' ? { $and: filters } : { $or: filters };
  
    Audience.find(query)
      .then(audiences => {
        console.log("Filtered audiences:", audiences); // Add this log
        res.status(200).json(audiences);
      })
      .catch(error => {
        console.error("Error in audience-size route:", error);
        res.status(500).json({ message: "Server Error", error });
      });
  });
  
  
  
  app.post('/campaign-history', async (req, res) => {
    try {
      const { filteredAudienceIds } = req.body;
  
      if (!filteredAudienceIds || filteredAudienceIds.length === 0) {
        return res.status(400).json({ message: 'No audience selected' });
      }
  
      // Find communication logs related to the selected audience IDs
      const logs = await CommunicationLog.find({ audienceId: { $in: filteredAudienceIds } })
        .sort({ createdAt: -1 }); // Sort by most recent
  
      res.status(200).json(logs);
    } catch (error) {
      console.error('Error fetching campaign history:', error);
      res.status(500).json({ message: 'Error fetching campaign history', error: error.message });
    }
  });
  

app.post('/register',(req,res)=>{
    EmployeeModel.create(req.body)
    .then(employees=>res.json(employees))
    .catch(err=>res.json(err))
});
  

// app.get('/oauth2callback', async (req, res) => {
//   const code = req.query.code; // The authorization code from Google
  
//   // Now, exchange the code for an access token or ID token
//   try {
//     const response = await axios.post('https://oauth2.googleapis.com/token', {
//       code,
//       redirect_uri: 'http://localhost:3001/oauth2callback',  // This should match the redirect URI in Google console
//       grant_type: 'authorization_code',
//     });

//     const { access_token, id_token } = response.data;
    
//     // Do something with the tokens (e.g., store in session or cookie)
//     res.json({ access_token, id_token });

//   } catch (error) {
//     console.error("Error exchanging code for token", error);
//     res.status(500).send("Internal Server Error");
//   }
// });


app.listen(3001, () => {
  console.log(" Server is running ");
});
