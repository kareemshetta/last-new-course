import express from "express";
import * as validators from "../../Middlewares/Validations/lessonValidation.js";
import { validation } from "../../Middlewares/validation.js";
import {
  createLesson,
  deleteLesson,
  getLessons,
  updateLesson,
} from "./lessonController.js";
import { fileUpload } from "../../utils/FileUpload.js";
import { fileValidation } from "../../utils/FileUpload.js";
let router = express.Router();
router
  .route("/")
  .post(
    fileUpload("lesson", fileValidation.file, true).fields([
      { name: "file" },
      { name: "homeworkFile" },
    ]),
    validation(validators.createLesson),
    createLesson
  )
  .get(getLessons);

router
  .route("/:id")
  .patch(
    fileUpload("lesson", fileValidation.file, true).fields([
      { name: "file" },
      { name: "homeworkFile" },
    ]),
    validation(validators.updateLesson),
    updateLesson
  )
  .delete(validation(validators.getById), deleteLesson);
export default router;
