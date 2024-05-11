import Joi from "joi";

export const createClass = Joi.object({
  name: Joi.string().required(),
});

export const getClassById = Joi.object({
  id: Joi.string().required(),
});
export const updateClass = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
});
