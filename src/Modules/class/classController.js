import { ClassSchema } from "../../../DB/dbConnection.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";

export const createClass = catchError(async (request, response, next) => {
  const { name } = request.body;
  const existingClass = await ClassSchema.findOne({ where: { name } });
  if (existingClass) {
    return next(ErrorMessage(409, "Class Already Exist 🙄"));
  }
  const newClass = await ClassSchema.create({
    name,
  });
  response.status(201).json({
    message: "Add New Class Successfully 😃",
    result: newClass,
  });
});

export const deleteClass = catchError(async (request, response, next) => {
  let { id } = request.params;
  let result = await ClassSchema.destroy({ where: { id } });
  if (!result) {
    return next(ErrorMessage(404, `Class Not Found 😥`));
  }
  response.status(200).json({
    message: "Delete Successfully 🤝",
  });
});

export const updateClass = catchError(async (request, response, next) => {
  let { id } = request.params;
  let { name } = request.body;
  let result = await ClassSchema.update({ name }, { where: { id } });
  if (!result) {
    return next(ErrorMessage(404, `Class Not Found 😥`));
  }
  response.status(200).json({
    message: "Update Successfully 🤝",
  });
});

export const getAllClass = catchError(async (request, response, next) => {
  let classes = await ClassSchema.findAll();
  response.status(200).json({
    message: "Get All Class Successfully 😃",
    classes,
  });
});
