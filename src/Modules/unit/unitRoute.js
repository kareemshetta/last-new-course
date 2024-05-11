import express from "express";
import * as validators from "../../Middlewares/Validations/unitValidation.js";
import { validation } from "../../Middlewares/validation.js";
import * as unitController from "./unitController.js";

let router = express.Router();
router
  .route("/")
  .get(unitController.getAllUnits)
  .post(validation(validators.createUnit), unitController.createUnit);

router
  .route("/:id")
  .delete(validation(validators.getUnitId), unitController.deleteUnit)
  .patch(validation(validators.getUnitId), unitController.updateUnit);

router.route("/:classId").get(unitController.getUnitByClassId);
export default router;
