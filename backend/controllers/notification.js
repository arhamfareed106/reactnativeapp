const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Notification = require('../models/Notification');
const User = require('../models/User');
const firebaseNotificationService = require('../services/firebase/notificationService');

// @desc      Get all notifications for logged-in user
// @route     GET /api/v1/notifications/my-notifications
// @access    Private
exports.getMyNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate('sender', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
});

// @desc      Get all notifications
// @route     GET /api/v1/notifications
// @access    Private/Admin
exports.getNotifications = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single notification
// @route     GET /api/v1/notifications/:id
// @access    Private
exports.getNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id)
    .populate('recipient', 'name email')
    .populate('sender', 'name email');

  if (!notification) {
    return next(
      new ErrorResponse(`No notification found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user can access notification
  if (
    req.user.role !== 'admin' &&
    req.user._id.toString() !== notification.recipient.toString()
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to access this notification`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc      Create new notification
// @route     POST /api/v1/notifications
// @access    Private/Admin
exports.createNotification = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.sender = req.user._id;

  const notification = await Notification.create(req.body);

  // Send Firebase notification if recipient has device token
  try {
    const recipient = await User.findById(notification.recipient);
    if (recipient && recipient.deviceToken) {
      await firebaseNotificationService.sendToDevice(
        recipient.deviceToken,
        notification.title,
        notification.message,
        {
          notificationId: notification._id.toString(),
          type: notification.type,
          entityId: notification.entityId ? notification.entityId.toString() : ''
        }
      );
    }
  } catch (error) {
    console.error('Error sending Firebase notification:', error);
    // Don't fail the whole operation if Firebase notification fails
  }

  res.status(201).json({
    success: true,
    data: notification
  });
});

// @desc      Update notification
// @route     PUT /api/v1/notifications/:id
// @access    Private/Admin
exports.updateNotification = asyncHandler(async (req, res, next) => {
  let notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(
      new ErrorResponse(`No notification found with id of ${req.params.id}`, 404)
    );
  }

  notification = await Notification.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc      Delete notification
// @route     DELETE /api/v1/notifications/:id
// @access    Private/Admin
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(
      new ErrorResponse(`No notification found with id of ${req.params.id}`, 404)
    );
  }

  await notification.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Mark notification as read
// @route     PUT /api/v1/notifications/mark-as-read/:id
// @access    Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id
  });

  if (!notification) {
    return next(
      new ErrorResponse(`No notification found with id of ${req.params.id}`, 404)
    );
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc      Mark all notifications as read
// @route     PUT /api/v1/notifications/mark-all-read
// @access    Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// @desc      Send notification to user
// @route     POST /api/v1/notifications/send-to-user
// @access    Private/Admin
exports.sendToUser = asyncHandler(async (req, res, next) => {
  const { userId, title, message, type, priority, relatedEntity, entityId } = req.body;

  // Validate recipient
  const recipient = await User.findById(userId);
  if (!recipient) {
    return next(new ErrorResponse('Recipient user not found', 404));
  }

  // Create notification
  const notification = await Notification.create({
    recipient: userId,
    sender: req.user._id,
    title,
    message,
    type: type || 'general',
    priority: priority || 'medium',
    relatedEntity,
    entityId
  });

  // Send Firebase notification if recipient has device token
  try {
    if (recipient.deviceToken) {
      await firebaseNotificationService.sendToDevice(
        recipient.deviceToken,
        title,
        message,
        {
          notificationId: notification._id.toString(),
          type: notification.type,
          entityId: notification.entityId ? notification.entityId.toString() : ''
        }
      );
    }
  } catch (error) {
    console.error('Error sending Firebase notification:', error);
    // Don't fail the whole operation if Firebase notification fails
  }

  res.status(201).json({
    success: true,
    data: notification
  });
});

// @desc      Get unread notifications count
// @route     GET /api/v1/notifications/unread-count
// @access    Private
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false
  });

  res.status(200).json({
    success: true,
    count
  });
});