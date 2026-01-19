const mongoose = require('mongoose');

const jobRoleSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
    maxlength: [100, 'Job title can not be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description can not be more than 1000 characters']
  },
  requirements: [{
    type: String
  }],
  responsibilities: [{
    type: String
  }],
  skillsRequired: [{
    type: String
  }],
  minQualifications: [{
    type: mongoose.Schema.ObjectId,
    ref: 'TrainingProgram'
  }],
  hourlyRate: {
    min: {
      type: Number,
      min: 0
    },
    max: {
      type: Number,
      min: 0
    }
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'temporary'],
    default: 'temporary'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('JobRole', jobRoleSchema);