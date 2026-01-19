const mongoose = require('mongoose');

const shiftRequestSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.ObjectId,
    ref: 'Worker',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  }
});

const shiftSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  jobRole: {
    type: mongoose.Schema.ObjectId,
    ref: 'JobRole',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a shift title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  startTime: {
    type: String, // Format: "HH:mm"
    required: [true, 'Please add a start time']
  },
  endTime: {
    type: String, // Format: "HH:mm"
    required: [true, 'Please add an end time']
  },
  requiredWorkers: {
    type: Number,
    required: [true, 'Please specify number of required workers'],
    min: 1
  },
  assignedWorkers: [{
    worker: {
      type: mongoose.Schema.ObjectId,
      ref: 'Worker'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['confirmed', 'completed', 'no-show', 'late'],
      default: 'confirmed'
    }
  }],
  requests: [shiftRequestSchema],
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  payRate: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    enum: ['open', 'filled', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Shift', shiftSchema);