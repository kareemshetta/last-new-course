import { DataTypes } from "sequelize";

export const createNotification = (sequelize) => {
  const Notification = sequelize.define("Notification", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    notificationType: { type: DataTypes.STRING },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    recipientType: {
      type: DataTypes.STRING, // e.g., 'Student', 'Teacher'
      allowNull: false,
    },
  });

  return Notification;
};
