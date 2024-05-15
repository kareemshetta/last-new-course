import {
  LessonSchema,
  UnitSchema,
  sequelize,
} from "../../../DB/dbConnection.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";

export const createUnit = catchError(async (request, response, next) => {
  const { name, classId } = request.body;
  const existingUnit = await UnitSchema.findOne({ where: { name, classId } });
  if (existingUnit) {
    return next(ErrorMessage(409, "هذه الوحدة موجودة بالفعل"));
  }
  const newUnit = await UnitSchema.create(request.body);
  response.status(201).json({
    message: "تم اضافة وحدة جديدة بنجاح",
    result: newUnit,
    statusCode: 201,
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
      return next(ErrorMessage(404, `الوحدة غير موجودة`));
    }

    await transaction.commit();
    response.status(200).json({
      message: "تم الحذف بنجاح",
      statusCode: 200,
    });
  } catch (error) {
    await transaction.rollback();
    next(ErrorMessage(500, `حدث خطأ ما`));
  }
});

export const updateUnit = catchError(async (request, response, next) => {
  let { id } = request.params;
  let { name, classId } = request.body;

  const existingUnit = await UnitSchema.findOne({ where: { name, classId } });
  if (existingUnit) {
    return next(ErrorMessage(409, "هناك وحدة بنفس الاسم موجودة بالفعل"));
  }

  let result = await UnitSchema.update({ name }, { where: { id } });
  if (!result) {
    return next(ErrorMessage(404, `هذه الوحدة غير موجودة`));
  }
  response.status(200).json({
    message: "تم تحديث الوحدة بنجاح",
    statusCode: 200,
  });
});

export const getUnitById = catchError(async (request, response, next) => {
  let { id } = request.params;
  let unit = await UnitSchema.findOne({ where: { id } });
  if (!unit) {
    return next(ErrorMessage(404, `هذه الوحدة غير موجودة`));
  }
  response.status(200).json({
    message: "Get Unit Successfully 😃",
    unit,
    statusCode: 200,
  });
});

export const getUnitByClassId = catchError(async (request, response, next) => {
  let { classId } = request.params;
  let units = await UnitSchema.findAll({
    where: { classId },
    include: { model: LessonSchema, as: "lessons" },
  });
  response.status(200).json({
    message: "Get Unit Successfully 😃",
    units,
    statusCode: 200,
  });
});

export const getAllUnits = catchError(async (request, response, next) => {
  let units = await UnitSchema.findAll();
  response.status(200).json({
    message: "Get All Units Successfully 😃",
    units,
    statusCode: 200,
  });
});
