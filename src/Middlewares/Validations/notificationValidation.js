import Joi from "joi";

export const getNotificationByRecipientId = Joi.object({
  recipientId: Joi.string().required(),
});

export const getNotificationById = Joi.object({
  id: Joi.string().required(),
});
