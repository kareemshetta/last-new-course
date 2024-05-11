import Joi from "joi";

export const createUnit = Joi.object({
  name: Joi.string().required(),
  classId: Joi.string().required(),
});

export const getUnitId = Joi.object({
  id: Joi.string().required(),
});
