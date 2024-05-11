import express from "express";
import * as validators from "../../Middlewares/Validations/examValidation.js";
import { validation } from "../../Middlewares/validation.js";
import * as examController from "./examController.js";
import { fileUpload } from "../../utils/FileUpload.js";
import { fileValidation } from "../../utils/FileUpload.js";
let router = express.Router();
router
  .route("/")
  .get(examController.getExams)
  .post(
    fileUpload("exam", fileValidation.file, true).single("file"),
    validation(validators.createExam),
    examController.createExam
  );

router
  .route("/:classId/competition")
  .get(examController.getCompetitionExamsByClassId);

router.route("/:groupId").get(examController.getAllExamByClassIdAndGroupId);
router
  .route("/:id")
  .delete(validation(validators.getById), examController.deleteExam);
export default router;
