const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');

// @desc      Get payments for a subscription
// @route     GET /api/v1/subscriptions/:subscriptionId/payments
// @access    Private
exports.getPayments = asyncHandler(async (req, res, next) => {
  // Check if user owns the subscription or is an admin
  const subscription = await Subscription.findById(req.params.subscriptionId);

  if (!subscription) {
    return next(
      new ErrorResponse(
        `No subscription found with id of ${req.params.subscriptionId}`,
        404
      )
    );
  }

  if (
    req.user.role !== 'admin' &&
    req.user._id.toString() !== subscription.user.toString()
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to access these payments`,
        401
      )
    );
  }

  const payments = await Payment.find({ subscription: req.params.subscriptionId }).populate([
    { path: 'subscription', select: 'planType amount status' }
  ]);

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments
  });
});

// @desc      Get single payment
// @route     GET /api/v1/subscriptions/:subscriptionId/payments/:id
// @access    Private
exports.getPayment = asyncHandler(async (req, res, next) => {
  // Check if user owns the subscription or is an admin
  const subscription = await Subscription.findById(req.params.subscriptionId);

  if (!subscription) {
    return next(
      new ErrorResponse(
        `No subscription found with id of ${req.params.subscriptionId}`,
        404
      )
    );
  }

  if (
    req.user.role !== 'admin' &&
    req.user._id.toString() !== subscription.user.toString()
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to access this payment`,
        401
      )
    );
  }

  const payment = await Payment.findById(req.params.id).populate([
    { path: 'subscription', select: 'planType amount status' }
  ]);

  if (!payment) {
    return next(
      new ErrorResponse(`No payment found with id of ${req.params.id}`, 404)
    );
  }

  // Ensure payment belongs to the specified subscription
  if (payment.subscription._id.toString() !== req.params.subscriptionId) {
    return next(
      new ErrorResponse(
        `Payment ${req.params.id} does not belong to subscription ${req.params.subscriptionId}`,
        400
      )
    );
  }

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc      Create new payment
// @route     POST /api/v1/subscriptions/:subscriptionId/payments
// @access    Private
exports.createPayment = asyncHandler(async (req, res, next) => {
  // Check if user owns the subscription or is an admin
  const subscription = await Subscription.findById(req.params.subscriptionId);

  if (!subscription) {
    return next(
      new ErrorResponse(
        `No subscription found with id of ${req.params.subscriptionId}`,
        404
      )
    );
  }

  if (
    req.user.role !== 'admin' &&
    req.user._id.toString() !== subscription.user.toString()
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to create a payment for this subscription`,
        401
      )
    );
  }

  // Add subscription to req.body
  req.body.subscription = req.params.subscriptionId;
  req.body.user = req.user._id;

  const payment = await Payment.create(req.body);

  // Update subscription payment status
  await Subscription.findByIdAndUpdate(
    req.params.subscriptionId,
    { 
      paymentStatus: 'paid',
      status: 'active',
      paymentMethod: req.body.method || payment.method
    },
    { new: true, runValidators: true }
  );

  res.status(201).json({
    success: true,
    data: payment
  });
});

// @desc      Update payment
// @route     PUT /api/v1/subscriptions/:subscriptionId/payments/:id
// @access    Private/Admin
exports.updatePayment = asyncHandler(async (req, res, next) => {
  // Only admin can update payments
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to update this payment`,
        401
      )
    );
  }

  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!payment) {
    return next(
      new ErrorResponse(`No payment found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc      Delete payment
// @route     DELETE /api/v1/subscriptions/:subscriptionId/payments/:id
// @access    Private/Admin
exports.deletePayment = asyncHandler(async (req, res, next) => {
  // Only admin can delete payments
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to delete this payment`,
        401
      )
    );
  }

  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(
      new ErrorResponse(`No payment found with id of ${req.params.id}`, 404)
    );
  }

  await payment.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});