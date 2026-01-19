const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');
const companies = require('./routes/companies');
const trainers = require('./routes/trainers');
const workers = require('./routes/workers');
const jobRoles = require('./routes/jobRoles');
const trainingPrograms = require('./routes/trainingPrograms');
const shifts = require('./routes/shifts');
const subscriptions = require('./routes/subscriptions');
const notifications = require('./routes/notifications');
const webhooks = require('./routes/webhooks');

const app = express();

// Body parser middleware
app.use(express.json());

// Middleware to handle raw body for Stripe webhook
app.post('/api/v1/webhooks/stripe', express.raw({type: 'application/json'}), (req, res, next) => {
  req.rawBody = req.body;
  next();
});

app.use(express.json());

// Enable CORS
app.use(cors());

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/companies', companies);
app.use('/api/v1/trainers', trainers);
app.use('/api/v1/workers', workers);
app.use('/api/v1/job-roles', jobRoles);
app.use('/api/v1/training-programs', trainingPrograms);
app.use('/api/v1/shifts', shifts);
app.use('/api/v1/subscriptions', subscriptions);
app.use('/api/v1/notifications', notifications);
app.use('/api/v1/webhooks', webhooks);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

module.exports = server;