// src/modules/notifications/notification.routes.js
const express = require("express");
const router = express.Router();
const notificationController = require("./notification.controller");

router.get("/", notificationController.getAllNotifications);
router.post("/", notificationController.createNotification);
router.put("/:id/markAsRead", notificationController.markAsRead);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
