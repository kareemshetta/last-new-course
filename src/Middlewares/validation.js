// export const validation = (schema) => {
//   return (request, response, next) => {
//     let inputs = { ...request.body, ...request.params, ...request.query };
//     let { error } = schema.validate(inputs, { abortEarly: false });
//     if (error) {
//       let errors = error.details.map((detail) => detail.message);
//       response.status(400).json(errors);
//     } else {
//       next();
//     }
//   };
// };

import joi from "joi";
const dataMethods = ["body", "params", "query", "headers", "file"];

const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("In-valid objectId");
};

export const generalFields = {
  email: joi.string(),
  // .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required(),
  cPassword: joi.string().required(),
  // id: joi.string().custom(validateObjectId),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
    dest: joi.string().required(),
  }),
};

export const validation = (schema) => {
  return (request, response, next) => {
    let inputs = {
      ...request.body,
      ...request.params,
      ...request.query,
    };
    console.log(request.files, request.file);
    // if (request.file || request.files) {
    //   inputs.file = request.file || request.files;
    // }

    if (request.file) {
      inputs.file = request.file;
    } else if (request.files) {
      for (const file in request.files) {
        inputs[file] = request.files[file];
      }
    }

    const { error } = schema.validate(inputs, { abortEarly: false });
    try {
      if (error) {
        let errors = error.details.map((detail) => detail.message);

        throw new Error(errors, { cause: 400 });
      }

      return next();
    } catch (err) {
      next(err);
    }
  };
};
