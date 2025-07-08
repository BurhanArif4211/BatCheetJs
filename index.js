// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/UserRoutes');
const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());
// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Auth API Running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});



// require('dotenv').config();
// const express = require('express');
// const app = express();
// const userRoutes = require('./routes/UserRoutes');

// // Middleware
// app.use(express.json());

// // Routes
// app.use('/api/users', userRoutes);

// // Test route
// app.get('/', (req, res) => {
//   res.send('Auth API Running');
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });