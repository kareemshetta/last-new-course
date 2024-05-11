import Joi from "joi";
import { generalFields } from "../validation.js";
export const login = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const register = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  firstName: Joi.string(),
  lastName: Joi.string().required(),
});

export const changePassword = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});

export const updateStudentResult = Joi.object({
  resultId: Joi.string().required(),
  score: Joi.number().required(),
});

export const changeStudentGroup = Joi.object({
  studentId: Joi.string().required(),
  groupId: Joi.string().required(),
});

export const updateTeacherData = Joi.object({
  file: generalFields.file,
  facebookUrl: Joi.string(),
  whatsappUrl: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
});
export const verifiedStudent = Joi.object({
  studentId: Joi.string().required(),
  verified: Joi.boolean().required(),
});

export const getStudentById = Joi.object({
  studentId: Joi.string().required(),
});
export const getExamResult = Joi.object({
  examId: Joi.string().required(),
});
