import {
  LessonSchema,
  NotificationSchema,
  UnitSchema,
  sequelize,
} from "../../../DB/dbConnection.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";

export const createUnit = catchError(async (request, response, next) => {
  const { name, classId } = request.body;
  const existingUnit = await UnitSchema.findOne({ where: { name, classId } });
  if (existingUnit) {
    return next(ErrorMessage(409, "Unit Already Exist 🙄"));
  }
  const newUnit = await UnitSchema.create({
    name,
    classId,
  });
  response.status(201).json({
    message: "Add New Unit Successfully 😃",
    result: newUnit,
  });
});

export const deleteUnit = catchError(async (request, response, next) => {
  const { id } = request.params;
  const transaction = await sequelize.transaction();
  try {
    await LessonSchema.destroy({
      where: { unitId: id },
      transaction: transaction,
    });
    const result = await UnitSchema.destroy({
      where: { id },
      transaction: transaction,
    });

    if (result === 0) {
      await transaction.rollback();
      return next(ErrorMessage(404, `Unit Not Found 😥`));
    }

    await transaction.commit();
    response.status(200).json({
      message: "Delete Successfully 🤝",
    });
  } catch (error) {
    await transaction.rollback();
    next(ErrorMessage(500, `Failed to delete unit: ${error.message}`));
  }
});

export const updateUnit = catchError(async (request, response, next) => {
  let { id } = request.params;
  let { name, classId } = request.body;

  const existingUnit = await UnitSchema.findOne({ where: { name, classId } });
  if (existingUnit) {
    return next(ErrorMessage(409, "Unit Already Exist 🙄"));
  }

  let result = await UnitSchema.update({ name }, { where: { id } });
  if (!result) {
    return next(ErrorMessage(404, `Unit Not Found 😥`));
  }
  response.status(200).json({
    message: "Update Successfully 🤝",
  });
});

export const getUnitById = catchError(async (request, response, next) => {
  let { id } = request.params;
  let unit = await UnitSchema.findOne({ where: { id } });
  if (!unit) {
    return next(ErrorMessage(404, `Unit Not Found 😥`));
  }
  response.status(200).json({
    message: "Get Unit Successfully 😃",
    unit,
  });
});

export const getUnitByClassId = catchError(async (request, response, next) => {
  let { classId } = request.params;
  let units = await UnitSchema.findAll({ where: { classId } });
  response.status(200).json({
    message: "Get Unit Successfully 😃",
    units,
  });
});

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
    });
  }
);
