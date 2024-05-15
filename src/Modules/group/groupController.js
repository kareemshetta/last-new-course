import { GroupSchema, ClassSchema } from "../../../DB/dbConnection.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";

export const createGroup = catchError(async (request, response, next) => {
  const { name, classId } = request.body;
  const existingGroup = await GroupSchema.findOne({ where: { name, classId } });

  if (existingGroup) {
    return next(ErrorMessage(409, "المجموعة غير موجودة"));
  }
  const existingClass = await ClassSchema.findByPk(classId);

  if (!existingClass) {
    return next(ErrorMessage(409, "الصف غير موجود"));
  }

  const newGroup = await GroupSchema.create(request.body);
  response.status(201).json({
    message: "تم اضافة المجموعة بنجاح",
    newGroup,
  });
});

export const updateGroup = catchError(async (request, response, next) => {
  let { id } = request.params;
  let { name } = request.body;

  const existingGroup = await GroupSchema.findOne({
    where: { name, classId },
  });
  if (existingGroup) {
    return next(ErrorMessage(409, "المجموعة غير موجودة"));
  }
  let result = await GroupSchema.update({ name }, { where: { id } });
  if (!result) {
    return next(ErrorMessage(404, `Group Not Found 😥`));
  }
  response.status(200).json({
    message: "تم تحديث المجموعة بنجاح",
  });
});

export const deleteGroup = catchError(async (request, response, next) => {
  let { id } = request.params;
  let result = await GroupSchema.destroy({ where: { id } }); // return 0 , 1
  if (!result) {
    return next(ErrorMessage(404, `المجموعة غير موجودة`));
  }
  response.status(200).json({
    message: "تم حذف المجموعة بنجاح",
  });
});

export const getAllGroup = catchError(async (request, response, next) => {
  const Groups = await GroupSchema.findAll();
  response.status(200).json({
    message: "Get All Groups Successfully 😃",
    Groups,
  });
});

export const getGroupByClassId = catchError(async (request, response, next) => {
  let { id } = request.params;
  const groups = await GroupSchema.findAll({ where: { classId: id } });
  response.status(200).json({
    groups,
  });
});
