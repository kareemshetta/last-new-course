import express from "express";
import * as studentController from "./studentController.js";
import * as validators from "../../Middlewares/Validations/studentValidation.js";
import { validation } from "../../Middlewares/validation.js";
import { protectedRoutes } from "../../utils/ProtectedRoutes.js";
import { fileUpload, fileValidation } from "../../utils/FileUpload.js";

let router = express.Router();

router.get("/", studentController.getAllStudent);

router.get("/myProfile", protectedRoutes, studentController.getStudentById);

router.route("/:id/profileImage").patch(
  fileUpload("profilePic", fileValidation.image).single("image"),
  // protectedRoutes,
  validation(validators.updateProfileImage),
  studentController.updateProfileImage
);
router
  .route("/changePassword")
  .patch(
    protectedRoutes,
    validation(validators.changePassword),
    studentController.changePassword
  );

router
  .route("/:id")
  .post(
    fileUpload(
      "exams_homework_answers",
      fileValidation.imageOrFile,
      true
    ).single("answerFile"),
    validation(validators.finishExam),
    studentController.finishExam
  )

  .delete(
    validation(validators.getStudentById),
    studentController.deleteStudent
  );

export default router;
