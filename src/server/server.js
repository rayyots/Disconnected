
// Backend server using Node.js and Express
// This would typically be in a separate repository and deployed separately

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock database
const users = {};

// Routes
app.post('/api/auth/verify', (req, res) => {
  const { phoneNumber, code } = req.body;
  
  // In a real app, we would verify the code here
  // For demo purposes, any code is valid
  
  // Create or update user
  if (!users[phoneNumber]) {
    users[phoneNumber] = {
      id: `user-${Date.now()}`,
      phoneNumber,
      dataBalance: 500, // 500 MB default
      rides: [],
      hasOwnData: false
    };
  }
  
  res.json({
    success: true,
    user: users[phoneNumber]
  });
});

app.post('/api/users/data-preference', (req, res) => {
  const { phoneNumber, hasOwnData } = req.body;
  
  if (users[phoneNumber]) {
    users[phoneNumber].hasOwnData = hasOwnData;
    
    res.json({
      success: true,
      user: users[phoneNumber]
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
});

app.post('/api/rides/complete', (req, res) => {
  const { phoneNumber, ride } = req.body;
  
  if (users[phoneNumber]) {
    // Add ride to user history
    users[phoneNumber].rides.push({
      ...ride,
      id: `ride-${Date.now()}`,
      date: new Date().toISOString()
    });
    
    // Deduct data from balance if user doesn't have own data
    if (!users[phoneNumber].hasOwnData) {
      users[phoneNumber].dataBalance -= ride.dataUsed || 0;
    }
    
    res.json({
      success: true,
      user: users[phoneNumber]
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
});

// New endpoint to get ride history
app.get('/api/rides/history', (req, res) => {
  const { phoneNumber } = req.query;
  
  if (users[phoneNumber]) {
    res.json({
      success: true,
      rides: users[phoneNumber].rides
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for potential serverless functions
module.exports = app;
