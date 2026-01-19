const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
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
  specialization: {
    type: String,
    required: [true, 'Please add a specialization'],
    enum: [
      'Safety Training',
      'Technical Skills',
      'Compliance',
      'Leadership',
      'Quality Control',
      'Operations',
      'Other'
    ]
  },
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String
  }],
  yearsOfExperience: {
    type: Number,
    min: 0
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio can not be more than 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trainer', trainerSchema);