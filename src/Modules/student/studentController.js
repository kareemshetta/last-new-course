import {
  ClassSchema,
  ExamSchema,
  GroupSchema,
  LessonSchema,
  ResultSchema,
  StudentSchema,
  TeacherSchema,
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
      {
        model: TeacherSchema,
        attributes: ["facebookUrl", "whatsappUrl"], // Only include facebookUrl and whatsappUrl attributes
      },
    ],
    attributes: { exclude: ["password"] },
  });

  if (!student) {
    return next(ErrorMessage(404, `الطالب غير موجود`));
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
    statusCode: 200,
  });
});

export const changePassword = catchError(async (request, response, next) => {
  let { id } = request.modal;
  let { newPassword, oldPassword } = request.body;
  const existingStudent = await StudentSchema.findByPk(id);
  if (!existingStudent) {
    return next(ErrorMessage(404, "الطالب غير موجود"));
  }
  const match = await bcrypt.compare(oldPassword, existingStudent.password);
  if (!match) {
    return next(ErrorMessage(401, "كلمة المرور القديمة غير صحيحة"));
  }
  existingStudent.password = newPassword;
  await existingStudent.save();
  response.status(200).json({
    message: "تم تغيير كلمة المرور بنجاح",
    statusCode: 200,
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
      statusCode: 200,
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
    return next(ErrorMessage(404, `الطالب غير موجود`));
  }
  if (examId) {
    const existingResult = await ResultSchema.findOne({
      where: { studentId: id, examId },
    });
    if (existingResult) {
      return next(ErrorMessage(403, `لقد قمت بالامتحان من قبل `));
    }

    const existingExam = await ExamSchema.findByPk(examId);

    if (!existingExam) {
      return next(ErrorMessage(404, `الامتحان غير موجود`));
    }
    if (+score > +existingExam?.score) {
      return next(ErrorMessage(404, `نتيجة غير صحيحة`));
    }

    if (existingExam.status == "finished") {
      score = 0;
      message = "لقد انتهت مدة الامتحان ، لا يمكنك تسجيل نتيجتك";
    }

    if (existingExam.status === "inactive") {
      return next(ErrorMessage(404, `الامتحان لم يبدء بعد`));
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
      message = "تم تسجيل نتيجتك بنجاح";

      // Create notification for the teacher
      await createNotification({
        notificationType: "exam_submission",
        title: "استلام امتحان",
        message: `${student.userName} تم استلام امتحان من الطالب `,
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
      return next(ErrorMessage(403, `لقد ارسالة نتيجتك من قبل`));
    }
    const existingLesson = await LessonSchema.findByPk(lessonId);
    if (!existingLesson) {
      return next(ErrorMessage(404, `الدرس غير موجود`));
    }

    if (+score > +existingLesson.score) {
      return next(ErrorMessage(404, `نتيجة غير صحيحة`));
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
        title: "استلام واجب",
        message: `${student.userName} تم استلام واجب من الطالب `,
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
    message = "تم تسجيل نتيجتك بنجاح";
  }

  response.status(200).json({
    message,
    statusCode: 200,
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

  response.status(200).json({
    allStudents: formattedStudents,
    statusCode: 200,
  });
});

export const deleteStudent = catchError(async (request, response, next) => {
  let { id } = request.params;

  const studentExist = await StudentSchema.findOne({
    where: { id },
    attributes: { exclude: ["password"] },
  });
  if (!studentExist) {
    return next(ErrorMessage(404, "الطالب غير موجود"));
  }

  await StudentSchema.destroy({
    where: { id },
  });

  response.status(200).json({
    message: "تم حذف الطالب بنجاح",
    statusCode: 200,
  });
});
