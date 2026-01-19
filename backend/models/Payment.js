const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  subscription: {
    type: mongoose.Schema.ObjectId,
    ref: 'Subscription',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  method: {
    type: String,
    enum: ['credit_card', 'paypal', 'bank_transfer', 'stripe'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    required: [true, 'Please add a transaction ID']
  },
  receiptUrl: {
    type: String
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true
  },
  periodStart: {
    type: Date,
    required: true
  },
  periodEnd: {
    type: Date,
    required: true
  },
  metadata: {
    type: Object
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);