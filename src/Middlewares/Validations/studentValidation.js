import Joi from "joi";
import { generalFields } from "../validation.js";

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(20).trim().required(),
  email: Joi.string().trim().required().email(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().max(11).required(),
  profilePic: Joi.string().required(),
  role: Joi.string().valid("user", "admin").required(),
  isActive: Joi.boolean().default(true),
  verified: Joi.boolean().default(false),
});

export const getStudentById = Joi.object({
  id: Joi.string().required(),
});
export const changePassword = Joi.object({
  oldPassword: Joi.string().min(3).required(),
  newPassword: Joi.string().min(3).required(),
});
export const updateProfileImage = Joi.object({
  id: Joi.string().required(),
  file: generalFields.file,
});

export const finishExam = Joi.object({
  id: Joi.string().required(),
  score: Joi.number(),
  examId: Joi.string(),
  lessonId: Joi.string(),
  file: generalFields.file,
})
  .or("lessonId", "examId")
  .required();

export const verifiedStudent = Joi.object({
  id: Joi.string().required(),
  verified: Joi.boolean().required(),
});

export const changeStudentGroup = Joi.object({
  id: Joi.string().required(),
  groupId: Joi.string().required(),
});
