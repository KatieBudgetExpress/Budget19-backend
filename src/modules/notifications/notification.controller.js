const Notification = require("../../models/notification.model");

// GET all notifications
exports.getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll();
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

// POST create notification
exports.createNotification = async (req, res, next) => {
  try {
    const { message, type } = req.body;
    const notification = await Notification.create({ message, type });
    res.status(201).json(notification);
  } catch (err) {
    next(err);
  }
};

// PUT mark notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    next(err);
  }
};

// DELETE notification
exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
