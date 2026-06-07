import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20);

  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });

  res.json({ success: true, notifications, unreadCount });
});

export const markAsRead = asyncHandler(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true, message: 'Marked as read' });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { isRead: true });
  res.json({ success: true, message: 'All marked as read' });
});
