const mongoose = require('mongoose');

const trainingModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  contentType: {
    type: String,
    enum: ['video', 'document', 'quiz', 'interactive'],
    required: true
  },
  contentUrl: {
    type: String,
    required: function() {
      return this.contentType !== 'quiz';
    }
  },
  duration: {
    type: Number, // in minutes
    min: 0
  },
  order: {
    type: Number,
    required: true
  }
});

const trainingProgramSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  trainer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Trainer',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description can not be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Safety',
      'Technical Skills',
      'Compliance',
      'Soft Skills',
      'Leadership',
      'Quality Control',
      'Operations',
      'Other'
    ]
  },
  modules: [trainingModuleSchema],
  duration: {
    type: Number, // in minutes
    min: 0
  },
  requiredFor: [{
    type: mongoose.Schema.ObjectId,
    ref: 'JobRole'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TrainingProgram', trainingProgramSchema);