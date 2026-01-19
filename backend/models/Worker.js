const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
    trim: true,
    maxlength: [30, 'First name can not be more than 30 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
    trim: true,
    maxlength: [30, 'Last name can not be more than 30 characters']
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be more than 20 characters']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  skills: [{
    type: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String
  }],
  qualifications: [{
    type: mongoose.Schema.ObjectId,
    ref: 'TrainingProgram'
  }],
  availability: {
    monday: { start: String, end: String, available: Boolean },
    tuesday: { start: String, end: String, available: Boolean },
    wednesday: { start: String, end: String, available: Boolean },
    thursday: { start: String, end: String, available: Boolean },
    friday: { start: String, end: String, available: Boolean },
    saturday: { start: String, end: String, available: Boolean },
    sunday: { start: String, end: String, available: Boolean }
  },
  preferences: {
    locationRadius: {
      type: Number,
      default: 10 // miles
    },
    preferredRoles: [{
      type: String
    }],
    workEnvironment: {
      indoor: Boolean,
      outdoor: Boolean,
      remote: Boolean
    }
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  subscriptionExpiry: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Worker', workerSchema);