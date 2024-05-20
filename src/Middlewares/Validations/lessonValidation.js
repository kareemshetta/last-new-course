import Joi from "joi";
import { generalFields } from "../validation.js";

export const createLesson = Joi.object({
  title: Joi.string(),
  description: Joi.string().required(),
  videoUrl: Joi.string().required(),
  unitId: Joi.string().required(),
  file: Joi.array().items(generalFields.file),
  homeworkFile: Joi.array().items(generalFields.file),
  homeworkQuestions: Joi.array().items(Joi.string()),
  score: Joi.number(),
  questionType: Joi.string().valid("PDF", "MCQ").required(),
  language: Joi.string().valid("English", "Arabic"),
  endShowingDate: Joi.date(),
});

export const updateLesson = Joi.object({
  id: Joi.string().required(),
  title: Joi.string(),
  description: Joi.string(),
  videoUrl: Joi.string(),
  unitId: Joi.string(),
  file: Joi.array().items(generalFields.file),
  homeworkFile: Joi.array().items(generalFields.file),
  homeworkQuestions: Joi.array().items(Joi.string()),
  score: Joi.number(),
  questionType: Joi.string().valid("PDF", "MCQ"),
});

export const getById = Joi.object({ id: Joi.string().required() });
