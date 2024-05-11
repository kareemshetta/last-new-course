import { NotificationSchema } from "../../DB/dbConnection.js";

export const createNotification = async ({
  title,
  message,
  recipientType,
  recipientId,
  notificationType,
}) => {
  try {
    const notification = await NotificationSchema.create({
      title,
      message,
      recipientType,
      recipientId,
      notificationType,
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};
