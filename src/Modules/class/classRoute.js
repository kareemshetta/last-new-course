import express from "express";
import * as classController from "./classController.js";
import { validation } from "../../Middlewares/validation.js";
import * as validators from "../../Middlewares/Validations/classValidation.js";
let router = express.Router();

router
  .route("/")
  .get(classController.getAllClass)
  .post(validation(validators.createClass), classController.createClass);

router
  .route("/:id")
  .patch(validation(validators.updateClass), classController.updateClass)
  .delete(validation(validators.getClassById), classController.deleteClass);
export default router;
