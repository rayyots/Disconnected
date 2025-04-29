
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

// Mock database with demo users
const users = {
  "01118692839": {
    id: "user-001",
    phoneNumber: "01118692839",
    username: "Omar Rayyan",
    email: "Rayyan@example.com",
    dataBalance: 500,
    rides: [],
    hasOwnData: false
  }
};

// Root route to fix "Cannot GET /" error
app.get('/', (req, res) => {
  res.send('Disconnected API Server is running. Use /api endpoints to interact with the API.');
});

// API routes
app.post('/api/auth/verify', (req, res) => {
  const { phoneNumber, code } = req.body;
  
  // In a real app, we would verify the code here
  // For demo purposes, any code is valid
  
  // Check if user exists in our demo accounts
  if (!users[phoneNumber]) {
    // If not found in demo users, create a new account
    users[phoneNumber] = {
      id: `user-${Date.now()}`,
      phoneNumber,
      username: "New User",
      email: "",
      dataBalance: 500,
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
      if (users[phoneNumber].dataBalance < 0) {
        users[phoneNumber].dataBalance = 0;
      }
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

// Get ride history
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

// Get user data
app.get('/api/users/data', (req, res) => {
  const { phoneNumber } = req.query;
  
  if (users[phoneNumber]) {
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for potential serverless functions
module.exports = app;
