import {
  ClassSchema,
  ExamSchema,
  GroupSchema,
  LessonSchema,
  ResultSchema,
  StudentSchema,
} from "../../../DB/dbConnection.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { createNotification } from "../../utils/NotificationService.js";
import { catchError } from "../../utils/catchAsyncError.js";
import bcrypt from "bcrypt";
export const getStudentById = catchError(async (request, response, next) => {
  let { id } = request.modal;
  const student = await StudentSchema.findOne({
    where: { id },
    include: [
      {
        model: ClassSchema,
        attributes: ["name"],
        as: "class",
      },
      {
        model: GroupSchema,
        attributes: ["name"],
        as: "group",
      },
      {
        model: ResultSchema,
        attributes: ["score"],
      },
    ],
    attributes: { exclude: ["password"] },
  });

  if (!student) {
    return next(ErrorMessage(404, `Student Not Found 😥`));
  }
  const studentData = student.toJSON();
  studentData.totalPoints =
    studentData.results?.reduce((acc, result) => acc + result.score, 0) || 0;
  studentData.ClassSchema = studentData.class.name;
  studentData.GroupSchema = studentData.group.name;
  delete studentData.results;
  delete studentData.class;
  delete studentData.group;

  response.status(200).json({
    studentData,
  });
});

export const changePassword = catchError(async (request, response, next) => {
  let { id } = request.modal;
  let { newPassword, oldPassword } = request.body;
  const existingStudent = await StudentSchema.findByPk(id);
  if (!existingStudent) {
    return next(ErrorMessage(404, "Student Not Found"));
  }
  const match = await bcrypt.compare(oldPassword, existingStudent.password);
  if (!match) {
    return next(ErrorMessage(401, "Incorrect Old Password"));
  }
  existingStudent.password = newPassword;
  await existingStudent.save();
  response.status(200).json({
    message: "Password Changed Successfully",
  });
});

export const updateProfileImage = catchError(
  async (request, response, next) => {
    let { id } = request.params;
    let { dest } = request.file;
    let result = await StudentSchema.update(
      { profileImage: dest },
      {
        where: { id },
        hooks: true,
      }
    );
    if (!result[0]) {
      return next(ErrorMessage(404, `Document Not Found 😥`));
    }
    response.status(200).json({
      message: "Profile Image Changed Successfully",
      result,
    });
  }
);

//* this endpoint will using by teacher if exam is [PDF] and student
export const finishExam = catchError(async (request, response, next) => {
  let { id } = request.params;
  let { score, examId, lessonId } = request.body;
  let message = "Exam Finished Successfully";
  const student = await StudentSchema.findByPk(id);

  if (!student) {
    return next(ErrorMessage(404, `Student Not Found 😥`));
  }
  if (examId) {
    const existingResult = await ResultSchema.findOne({
      where: { studentId: id, examId },
    });
    if (existingResult) {
      return next(
        ErrorMessage(403, `sorry you have already finished this exam 😥`)
      );
    }

    const existingExam = await ExamSchema.findByPk(examId);

    console.log({
      score,
      examScore: existingExam.score,
    });
    if (!existingExam) {
      return next(ErrorMessage(404, `Exam Not Found 😥`));
    }
    if (+score > +existingExam.score) {
      return next(ErrorMessage(404, `invalid Score 😥`));
    }

    if (existingExam.status == "finished") {
      score = 0;
      message = "Exam Expired and your score is 0";
    }

    if (existingExam.status === "inactive") {
      return next(ErrorMessage(404, `Exam not start yet`));
    }

    if (existingExam.questionType == "PDF" && request.file) {
      const { dest } = request.file;
      await ResultSchema.create({
        score: 0,
        studentId: id,
        examId,
        status: "Pending",
        answerFile: dest,
      });
      message = "You have successfully submitted your exam";

      // Create notification for the teacher
      await createNotification({
        notificationType: "exam_submission",
        title: "Exam Submission",
        message: `${student.userName} has submitted a PDF exam for verification.`,
        recipientType: "Teacher",
        teacherId: student.teacherId,
      });
    } else {
      await ResultSchema.create({
        score,
        studentId: id,
        examId,
        status: "Completed",
      });
    }
  }

  if (lessonId) {
    const existingResult = await ResultSchema.findOne({
      where: { studentId: id, lessonId },
    });
    if (existingResult) {
      return next(
        ErrorMessage(
          403,
          `sorry you have already submitted your homework answer😥`
        )
      );
    }
    const existingLesson = await LessonSchema.findByPk(lessonId);
    if (!existingLesson) {
      return next(ErrorMessage(404, `lesson Not Found 😥`));
    }

    if (+score > +existingLesson.score) {
      return next(ErrorMessage(404, `invalid Score 😥`));
    }
    if (existingLesson.questionType == "PDF" && request.file) {
      const { dest } = request.file;
      await ResultSchema.create({
        score: 0,
        studentId: id,
        lessonId,
        answerFile: dest,
        status: "Pending",
      });

      // Create notification for the teacher
      await createNotification({
        notificationType: "homework_submission",
        title: "Homework Submission",
        message: `${student.userName} has submitted a PDF homework for verification.`,
        recipientType: "Teacher",
        teacherId: student.teacherId,
      });
    } else {
      await ResultSchema.create({
        score,
        studentId: id,
        lessonId,
        status: "Completed",
      });
    }
    message = "You have successfully submitted your homework";
  }

  response.status(200).json({
    message,
  });
});

export const getAllStudent = catchError(async (request, response, next) => {
  const students = await StudentSchema.findAll({
    attributes: { exclude: ["password"] },
    include: [
      {
        model: ClassSchema,
        attributes: ["name"],
        as: "class",
      },
      {
        model: GroupSchema,
        attributes: ["name"],
        as: "group",
      },
      {
        model: ResultSchema,
        attributes: ["score"],
      },
    ],
  });

  const formattedStudents = students.map((student) => {
    const studentData = student.toJSON();
    studentData.totalPoints =
      studentData.results?.reduce((acc, result) => acc + result.score, 0) || 0;
    studentData.ClassSchema = studentData.class.name;
    studentData.GroupSchema = studentData.group.name;
    delete studentData.results;
    delete studentData.class;
    delete studentData.group;
    return studentData;
  });

  // const students = await sequelize.query(
  //   `SELECT "userName", "phone", "address","email","phone",
  //  "profileImage",students."id" as "studentId",
  //    classes."name" as "className", groups."name" as "groupName",
  //       COALESCE(SUM(results."score"), 0) as "totalPoints"  FROM public.students
  //   LEFT JOIN results ON students."id"=results."studentId"
  //   JOIN classes ON classes."id"=students."classId"
  //   JOIN groups ON groups."id"=students."groupId"
  //   group by students."id", classes."name",
  //   groups."name" `,
  //   {
  //     type: QueryTypes.SELECT,
  //   }
  // );

  response.status(200).json({
    allStudents: formattedStudents,
  });
});

export const deleteStudent = catchError(async (request, response, next) => {
  let { id } = request.params;

  const studentExist = await StudentSchema.findOne({
    where: { id },
    attributes: { exclude: ["password"] },
  });
  if (!studentExist) {
    return next(ErrorMessage(404, "Student Not Found"));
  }

  await StudentSchema.destroy({
    where: { id },
  });

  response.status(200).json({
    message: "Student Deleted Successfully",
  });
});
