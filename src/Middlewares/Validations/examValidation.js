import Joi from "joi";
import { generalFields } from "../validation.js";

export const createExam = Joi.object({
  title: Joi.string().required(),
  examType: Joi.string().valid("EXAM", "HOMEWORK", "COMPETITION").required(),
  questionType: Joi.string().valid("PDF", "MCQ").required(),
  file: generalFields.file,
  description: Joi.string().required(),
  language: Joi.string().valid("English", "Arabic").required(),
  duration: Joi.string(),
  startTime: Joi.date(),
  score: Joi.number().required(),
  classId: Joi.string().required(),
  groupsId: Joi.array().items(Joi.string()),
  questions: Joi.array().items(
    Joi.object({
      questionText: Joi.string().required(),
      options: Joi.array().items(Joi.string()).required(),
      correctAnswer: Joi.string().required(),
      questionScore: Joi.number(),
    })
  ),
});

export const getById = Joi.object({
  id: Joi.string().required(),
});
