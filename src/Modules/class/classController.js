import { ClassSchema } from "../../../DB/dbConnection.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";

export const createClass = catchError(async (request, response, next) => {
  const { name } = request.body;
  const existingClass = await ClassSchema.findOne({ where: { name } });
  if (existingClass) {
    return next(ErrorMessage(409, "الصف موجود من قبل"));
  }
  const newClass = await ClassSchema.create({
    name,
  });
  response.status(201).json({
    message: "تم اضافة الصف بنجاح",
    result: newClass,
    statusCode: 201,
  });
});

export const deleteClass = catchError(async (request, response, next) => {
  let { id } = request.params;
  let result = await ClassSchema.destroy({ where: { id } });
  if (!result) {
    return next(ErrorMessage(404, `الصف غير موجود`));
  }
  response.status(200).json({
    message: "تم حذف الصف بنجاح",
    statusCode: 200,
  });
});

export const updateClass = catchError(async (request, response, next) => {
  let { id } = request.params;
  let { name } = request.body;
  let result = await ClassSchema.update({ name }, { where: { id } });
  if (!result) {
    return next(ErrorMessage(404, `الصف غير موجود`));
  }
  response.status(200).json({
    message: "تم تحديث الصف بنجاح",
    statusCode: 200,
  });
});

export const getAllClass = catchError(async (request, response, next) => {
  let classes = await ClassSchema.findAll();
  response.status(200).json({
    message: "Get All Class Successfully 😃",
    classes,
    statusCode: 200,
  });
});
