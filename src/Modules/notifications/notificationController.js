import { NotificationSchema } from "../../../DB/dbConnection.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";

export const getAllNotificationsForStudent = catchError(
  async (request, response, next) => {
    let { recipientId } = request.params;
    let notifications = await NotificationSchema.findAll({
      where: { studentId: recipientId, isRead: false },
    });
    response.status(200).json({
      message: "Get All Notifications Successfully 😃",
      notifications,
    });
  }
);

export const getAllNotificationsForTeacher = catchError(
  async (request, response, next) => {
    let { recipientId } = request.params;
    let notifications = await NotificationSchema.findAll({
      where: { teacherId: recipientId, isRead: false },
    });
    response.status(200).json({
      message: "Get All Notifications Successfully 😃",
      notifications,
      statusCode: 200,
    });
  }
);

export const makeNotificationAsRead = catchError(
  async (request, response, next) => {
    let { id } = request.params;
    let result = await NotificationSchema.update(
      { isRead: true },
      { where: { id } }
    );
    if (!result) {
      return next(ErrorMessage(404, `Notification Not Found 😥`));
    }
    response.status(200).json({
      message: "Update Successfully 🤝",
      statusCode: 200,
    });
  }
);
