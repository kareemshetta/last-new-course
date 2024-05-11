import Joi from "joi";
import { generalFields } from "../validation.js";

export const createBook = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  pdf: Joi.array().items(generalFields.file).required(),
  cover: Joi.array().items(generalFields.file).required(),
  classId: Joi.string().required(),
});

export const updateBook = Joi.object({
  id: Joi.string().required(),
  title: Joi.string(),
  description: Joi.string(),

  pdf: Joi.array().items(generalFields.file),
  cover: Joi.array().items(generalFields.file),
  classId: Joi.string().required(),
});

export const getBook = Joi.object({
  id: Joi.string().required(),
});
