import Joi from "joi";

export const register = Joi.object({
  userName: Joi.string().required(),
  phone: Joi.string().required(),
  parentPhoneNumber: Joi.string().required(),
  address: Joi.string().required(),

  password: Joi.string().required(),
  email: Joi.string().email().required(),
  teacherId: Joi.string().required(),
  classId: Joi.string().required(),
  groupId: Joi.string().required(),
});
export const login = Joi.object({
  phone: Joi.string().required(),
  password: Joi.string().required(),
});
