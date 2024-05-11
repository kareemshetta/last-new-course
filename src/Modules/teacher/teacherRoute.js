import express from "express";
import * as validators from "../../Middlewares/Validations/teacherValidation.js";
import { validation } from "../../Middlewares/validation.js";
import * as teacherController from "./teacherController.js";
import { protectedRoutes } from "../../utils/ProtectedRoutes.js";
import { fileValidation } from "../../utils/FileUpload.js";
import { fileUpload } from "../../utils/FileUpload.js";
let router = express.Router();
router.get(
  "/getPendingHomeWork",
  teacherController.getAllResultFroPendingHomeWork
);
router.post(
  "/verifyStudent/:studentId",
  validation(validators.verifiedStudent),
  teacherController.verifiedStudent
);

router
  .route("/")
  .get(protectedRoutes, teacherController.getTeacherDetails)
  .patch(
    fileUpload("profilePic", fileValidation.image).single("image"),
    protectedRoutes,
    validation(validators.updateTeacherData),
    teacherController.updateTeacherData
  );

router.patch(
  "/changeStudentGroup/:studentId",
  validation(validators.changeStudentGroup),
  teacherController.changeStudentGroup
);
router.patch(
  "/updateStudentResult/:resultId",
  validation(validators.updateStudentResult),
  teacherController.updateStudentResult
);

router
  .route("/login")
  .post(validation(validators.login), teacherController.login);
router
  .route("/register")
  .post(validation(validators.register), teacherController.register);

router.patch(
  "/changePassword",
  protectedRoutes,
  validation(validators.changePassword),
  teacherController.changePassword
);

router.get(
  "/:examId/results",
  validation(validators.getExamResult),
  teacherController.getExamResults
);
router.get(
  "/:studentId",
  validation(validators.getStudentById),
  teacherController.getStudentById
);

export default router;
