import Notification from '../models/Notification.js';

export const createNotification = async ({ userId, type, title, message, link = '' }) => {
  try {
    await Notification.create({ user: userId, type, title, message, link });
  } catch (error) {
    console.error('Notification error:', error.message);
  }
};

export const notifyAdmins = async (User, { type, title, message, link }) => {
  try {
    const admins = await User.find({ role: 'admin', isActive: true });
    await Promise.all(
      admins.map((admin) =>
        Notification.create({ user: admin._id, type, title, message, link })
      )
    );
  } catch (error) {
    console.error('Admin notification error:', error.message);
  }
};
