import { GroupSchema, ClassSchema } from "../../../DB/dbConnection.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";

export const createGroup = catchError(async (request, response, next) => {
  const { name, classId } = request.body;
  const existingGroup = await GroupSchema.findOne({ where: { name, classId } });

  if (existingGroup) {
    return next(ErrorMessage(409, "Group Already Exist 🙄"));
  }
  const existingClass = await ClassSchema.findByPk(classId);

  if (!existingClass) {
    return next(ErrorMessage(409, "Class Not Found 🙄"));
  }

  const newGroup = await GroupSchema.create(request.body);
  response.status(201).json({
    message: "Add New Group Successfully 😃",
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
    return next(ErrorMessage(409, "Group Already Exist 🙄"));
  }
  let result = await GroupSchema.update({ name }, { where: { id } });
  if (!result) {
    return next(ErrorMessage(404, `Group Not Found 😥`));
  }
  response.status(200).json({
    message: "Update Successfully 🤝",
  });
});

export const deleteGroup = catchError(async (request, response, next) => {
  let { id } = request.params;
  let result = await GroupSchema.destroy({ where: { id } }); // return 0 , 1
  if (!result) {
    return next(ErrorMessage(404, `Group Not Found 😥`));
  }
  response.status(200).json({
    message: "Delete Successfully 🤝",
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
