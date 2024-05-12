import { NotificationSchema } from "../../DB/dbConnection.js";

export const createNotification = async ({
  title,
  message,
  recipientType,
  teacherId,
  studentId,
  notificationType,
}) => {
  try {
    if (studentId) {
      const notification = await NotificationSchema.create({
        title,
        message,
        recipientType,
        studentId,
        notificationType,
      });

      return notification;
    } else {
      const notification = await NotificationSchema.create({
        title,
        message,
        recipientType,
        teacherId,
        notificationType,
      });
      return notification;
    }

    // return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};
