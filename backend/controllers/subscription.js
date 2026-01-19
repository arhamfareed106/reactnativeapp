const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Company = require('../models/Company');
const Worker = require('../models/Worker');
const paymentService = require('../services/paymentService');

// @desc      Get all subscriptions
// @route     GET /api/v1/subscriptions
// @access    Private/Admin
exports.getSubscriptions = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single subscription
// @route     GET /api/v1/subscriptions/:id
// @access    Private
exports.getSubscription = asyncHandler(async (req, res, next) => {
  const subscription = await Subscription.findById(req.params.id).populate([
    { path: 'user', select: 'name email role' },
    { path: 'company', select: 'name contactEmail' },
    { path: 'worker', select: 'firstName lastName' }
  ]);

  if (!subscription) {
    return next(
      new ErrorResponse(
        `No subscription found with id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user can access subscription
  if (
    req.user.role !== 'admin' &&
    req.user._id.toString() !== subscription.user.toString()
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to access this subscription`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: subscription
  });
});

// @desc      Create new subscription
// @route     POST /api/v1/subscriptions
// @access    Private
exports.createSubscription = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user._id;

  // Check if user already has an active subscription
  const existingSubscription = await Subscription.findOne({
    user: req.user._id,
    status: { $in: ['active', 'pending'] }
  });

  if (existingSubscription) {
    return next(
      new ErrorResponse(
        'User already has an active or pending subscription',
        400
      )
    );
  }

  // For company users, add company reference
  if (req.user.role === 'company') {
    const company = await Company.findOne({ user: req.user._id });
    if (!company) {
      return next(new ErrorResponse('Company not found', 404));
    }
    req.body.company = company._id;
  }
  // For worker users, add worker reference
  else if (req.user.role === 'worker') {
    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker) {
      return next(new ErrorResponse('Worker not found', 404));
    }
    req.body.worker = worker._id;
  }

  // If payment method is Stripe, process the payment
  if (req.body.paymentMethod === 'stripe') {
    const planData = {
      planType: req.body.planType,
      amount: req.body.amount,
      currency: req.body.currency || 'USD',
      billingCycle: req.body.billingCycle || 'monthly'
    };
    
    const result = await paymentService.createSubscription(req.user._id, planData);
    
    res.status(201).json({
      success: true,
      data: result.subscription,
      clientSecret: result.clientSecret
    });
  } else {
    // For other payment methods, create subscription directly
    const subscription = await Subscription.create(req.body);

    res.status(201).json({
      success: true,
      data: subscription
    });
  }
});

// @desc      Update subscription
// @route     PUT /api/v1/subscriptions/:id
// @access    Private
exports.updateSubscription = asyncHandler(async (req, res, next) => {
  let subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return next(
      new ErrorResponse(
        `No subscription found with id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user can update subscription
  if (
    req.user.role !== 'admin' &&
    req.user._id.toString() !== subscription.user.toString()
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to update this subscription`,
        401
      )
    );
  }

  subscription = await Subscription.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: subscription
  });
});

// @desc      Delete subscription
// @route     DELETE /api/v1/subscriptions/:id
// @access    Private/Admin
exports.deleteSubscription = asyncHandler(async (req, res, next) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return next(
      new ErrorResponse(
        `No subscription found with id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure admin is updating
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to delete this subscription`,
        401
      )
    );
  }

  await subscription.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Get user's subscriptions
// @route     GET /api/v1/subscriptions/my-subscriptions
// @access    Private
exports.getUserSubscriptions = asyncHandler(async (req, res, next) => {
  const subscriptions = await Subscription.find({ user: req.user._id }).populate([
    { path: 'user', select: 'name email role' },
    { path: 'company', select: 'name contactEmail' },
    { path: 'worker', select: 'firstName lastName' }
  ]);

  res.status(200).json({
    success: true,
    count: subscriptions.length,
    data: subscriptions
  });
});

// @desc      Cancel subscription
// @route     PUT /api/v1/subscriptions/:id/cancel
// @access    Private
exports.cancelSubscription = asyncHandler(async (req, res, next) => {
  let subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return next(
      new ErrorResponse(
        `No subscription found with id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user can cancel subscription
  if (
    req.user.role !== 'admin' &&
    req.user._id.toString() !== subscription.user.toString()
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to cancel this subscription`,
        401
      )
    );
  }

  // If the subscription is linked to Stripe, cancel it there too
  if (subscription.stripeSubscriptionId) {
    await paymentService.cancelSubscription(req.params.id);
  }

  subscription = await Subscription.findByIdAndUpdate(
    req.params.id,
    { status: 'cancelled' },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: subscription
  });
});

// @desc      Renew subscription
// @route     PUT /api/v1/subscriptions/:id/renew
// @access    Private
exports.renewSubscription = asyncHandler(async (req, res, next) => {
  let subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return next(
      new ErrorResponse(
        `No subscription found with id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user can renew subscription
  if (
    req.user.role !== 'admin' &&
    req.user._id.toString() !== subscription.user.toString()
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to renew this subscription`,
        401
      )
    );
  }

  // If the subscription is linked to Stripe, process renewal through Stripe
  if (subscription.stripeSubscriptionId) {
    const renewedSubscription = await paymentService.renewSubscription(req.params.id);
    
    res.status(200).json({
      success: true,
      data: renewedSubscription
    });
  } else {
    // Calculate new end date based on billing cycle
    const now = new Date();
    let endDate = new Date(now);
    
    if (subscription.billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (subscription.billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      {
        status: 'active',
        startDate: now,
        endDate: endDate,
        paymentStatus: 'pending' // Will be updated after payment processing
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: subscription
    });
  }
});

// @desc      Get subscription stats (for admin)
// @route     GET /api/v1/subscriptions/stats/overview
// @access    Private/Admin
exports.getSubscriptionStats = asyncHandler(async (req, res, next) => {
  const stats = await Subscription.aggregate([
    {
      $group: {
        _id: '$planType',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$amount' },
        activeCount: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        }
      }
    }
  ]);

  const totalRevenue = await Subscription.aggregate([
    {
      $match: {
        paymentStatus: 'paid'
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  const pendingRenewals = await Subscription.countDocuments({
    status: { $ne: 'cancelled' },
    endDate: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // Within 7 days
  });

  const successRate = await Subscription.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        paid: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] }
        }
      }
    }
  ]);

  const successPercentage = successRate.length > 0 
    ? Math.round((successRate[0].paid / successRate[0].total) * 100 * 100) / 100
    : 100;

  res.status(200).json({
    success: true,
    data: {
      byPlanType: stats,
      totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0,
      pendingRenewals,
      paymentSuccessRate: successPercentage
    }
  });
});

// @desc      Get payment history (for admin)
// @route     GET /api/v1/subscriptions/payment-history
// @access    Private/Admin
exports.getPaymentHistory = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;

  // Build query
  let query = {};
  
  // Add filters if provided
  if (req.query.status) {
    query.paymentStatus = req.query.status;
  }
  
  if (req.query.startDate && req.query.endDate) {
    query.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  const total = await Subscription.countDocuments(query);
  const subscriptions = await Subscription.find(query)
    .populate([
      { path: 'user', select: 'name email' },
      { path: 'company', select: 'name' },
      { path: 'worker', select: 'firstName lastName' }
    ])
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    count: subscriptions.length,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords: total,
      hasNext: page < totalPages,
      hasPrev: page > 1
    },
    data: subscriptions
  });
});