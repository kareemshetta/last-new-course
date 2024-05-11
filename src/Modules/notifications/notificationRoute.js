import express from "express";
import { validation } from "../../Middlewares/validation.js";
import * as notificationsController from "./notificationController.js";
import * as notificationValidator from "../../Middlewares/Validations/notificationValidation.js";
let router = express.Router();
router
  .route("/:recipientId/student")
  .get(
    validation(notificationValidator.getNotificationByRecipientId),
    notificationsController.getAllNotificationsForStudent
  );

router
  .route("/:recipientId/teacher")
  .get(
    validation(notificationValidator.getNotificationByRecipientId),
    notificationsController.getAllNotificationsForTeacher
  );

router.patch(
  "/:id",
  validation(notificationValidator.getNotificationById),
  notificationsController.makeNotificationAsRead
);
// .post(validation(validators.createUnit), unitController.createUnit);

export default router;
