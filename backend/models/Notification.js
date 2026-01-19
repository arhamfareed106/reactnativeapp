const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    maxlength: [500, 'Message can not be more than 500 characters']
  },
  type: {
    type: String,
    enum: [
      'shift_request',
      'shift_approval',
      'shift_rejection',
      'shift_reminder',
      'subscription_expiry',
      'training_completed',
      'payment_success',
      'general'
    ],
    required: true
  },
  relatedEntity: {
    type: String,
    enum: ['shift', 'training', 'subscription', 'user', 'company']
  },
  entityId: {
    type: mongoose.Schema.ObjectId
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);