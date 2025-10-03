const express = require("express");
const router = express.Router();
const notificationController = require("./notification.controller");

// CRUD Notifications
router.get("/", notificationController.getAllNotifications);
router.post("/", notificationController.createNotification);
router.put("/:id/markAsRead", notificationController.markAsRead);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
