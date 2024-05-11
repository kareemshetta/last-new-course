import Joi from "joi";

export const createGroup = Joi.object({
  name: Joi.string().required(),
  classId: Joi.string().required(),
});

export const updateGroup = Joi.object({
  id: Joi.string().required(),
  name: Joi.string(),
});

export const getById = Joi.object({
  id: Joi.string().required(),
});
