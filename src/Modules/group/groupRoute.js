import express from "express";
import * as validators from "../../Middlewares/Validations/groupValidation.js";
import { validation } from "../../Middlewares/validation.js";
import * as groupController from "./groupController.js";
let router = express.Router();

router
  .route("/")
  .post(validation(validators.createGroup), groupController.createGroup)
  .get(groupController.getAllGroup);

router
  .route("/class/:id")
  .get(validation(validators.getById), groupController.getGroupByClassId);

router
  .route("/:id")
  .patch(validation(validators.updateGroup), groupController.updateGroup)
  .delete(validation(validators.getById), groupController.deleteGroup);

export default router;
