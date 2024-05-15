import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
import { catchError } from "../../utils/catchAsyncError.js";
import { createNotification } from "../../utils/NotificationService.js";
export const login = catchError(async (request, response, next) => {
  const { email, password } = request.body;
  const teacher = await TeacherSchema.findOne({
    where: { email },
  });
  const match = await bcrypt.compare(password, teacher ? teacher.password : "");
  if (teacher && match) {
    let token = jwt.sign(
      {
        id: teacher.id,
        type: "teacher",
      },
      process.env.SECRET_KEY
    );
    return response.status(200).json({
      statusCode: 200,
      token,
    });
  }
  next(ErrorMessage(401, "يوجد خطأ في البريد الالكتروني او كلمة المرور"));
});

export const register = catchError(async (request, response, next) => {
  const existingTeacher = await TeacherSchema.findOne({
    where: { email: request.body.email },
  });
  if (existingTeacher) {
    return next(ErrorMessage(409, "المعلم موجود بالفعل"));
  }
  console.log(request.body);
  const newTeacher = await TeacherSchema.create(request.body);
  response.status(201).json({
    message: "تم تسجيل المعلم بنجاح",
    result: newTeacher,
    statusCode: 201,
  });
});

export const changePassword = catchError(async (request, response, next) => {
  let { id } = request.modal;
  let { newPassword, oldPassword } = request.body;
  const existingTeacher = await TeacherSchema.findByPk(id);
  if (!existingTeacher) {
    return next(ErrorMessage(404, "المعلم غير موجود"));
  }
  const match = await bcrypt.compare(oldPassword, existingTeacher.password);
  if (!match) {
    return next(ErrorMessage(401, "كلمة المرور القديمة غير صحيحة"));
  }
  existingTeacher.password = newPassword;
  await existingTeacher.save();
  response.status(200).json({
    message: "تم تغيير كلمة المرور بنجاح",
    statusCode: 200,
  });
});

export const updateTeacherData = catchError(async (request, response, next) => {
  let { id } = request.modal;

  const existingTeacher = await TeacherSchema.findByPk(id);
  if (!existingTeacher) {
    return next(ErrorMessage(404, "المعلم غير موجود"));
  }
  const body = { ...request.body };
  if (request.file) {
    body.profileImage = request.file.dest;
  }

  await TeacherSchema.update(body, { where: { id } });

  response.status(200).json({
    message: "تم تحديث بيانات المعلم بنجاح",
    statusCode: 200,
  });
});

export const verifiedStudent = catchError(async (request, response, next) => {
  let { studentId } = request.params;
  let { verified } = request.body;
  const student = await StudentSchema.findOne({
    where: { id: studentId },
    attributes: { exclude: ["password"] },
  });
  if (!student) {
    return next(ErrorMessage(404, "Student Not Found"));
  }
  student.verified = verified;
  const newStudent = await student.save({
    fields: ["verified"],
  });
  // Create notification for the student
  await createNotification({
    title: `${verified ? "تم تفعيل الحساب" : "تم الغاء تفعيل الحساب"}`,
    message: `${verified ? "تم تفعيل حسابك بنجاح" : "تم الغاء تفعيل حسابك"}`,
    recipientType: "Student",
    studentId: studentId,
    notificationType: "verification",
  });
  response.status(200).json({
    message: `${verified ? "تم تفعيل حسابك بنجاح" : "تم الغاء تفعيل حسابك"}`,
    newStudent,
    statusCode: 200,
  });
});
export const changeStudentGroup = catchError(
  async (request, response, next) => {
    let { studentId } = request.params;
    let { groupId } = request.body;

    const studentExist = await StudentSchema.findOne({
      where: { id: studentId },
      attributes: { exclude: ["password"] },
    });
    if (!studentExist) {
      return next(ErrorMessage(404, "الطالب غير موجود"));
    }
    const groupExists = await GroupSchema.findOne({
      where: { id: groupId },
    });
    if (!groupExists) {
      return next(ErrorMessage(404, "المجموعة غير موجودة"));
    }

    if (studentExist.classId !== groupExists.classId) {
      return next(
        ErrorMessage(
          403,
          "لا يمكن تغير المجموعة لانها ليست مجموعة في نفس الصف "
        )
      );
    }

    studentExist.groupId = groupId;
    const result = await studentExist.save({
      fields: ["groupId"],
    });

    // Create notification for the student
    await createNotification({
      title: "تغيير المجموعة",
      message: `تم تغير المجموعة بنجاح الى ${groupExists?.name}`,
      recipientType: "Student",
      studentId: studentId,
      notificationType: "changeGroup",
    });

    response.status(200).json({
      message: "تم تغيير المجموعة بنجاح",
      student: result,
      statusCode: 200,
    });
  }
);

export const updateStudentResult = catchError(
  async (request, response, next) => {
    const { resultId } = request.params;
    const { score } = request.body;
    const result = await ResultSchema.update(
      { score, status: "Completed" },
      {
        where: { id: resultId },
        hooks: true,
      }
    );
    if (!result) {
      return next(ErrorMessage(404, "Result Not Found"));
    }

    // Create notification for the student
    await createNotification({
      title: `${result.examId ? "تم تصحيح الامتحان" : "تم تصحيح الواجب"}`,
      message: `${
        result.examId
          ? `تم تصحيح الامتحان وحصلت علي النتيجة ${score}`
          : `تم تصحيح الواجب وحصلت علي النتيجة ${score}`
      }`,
      recipientType: "Student",
      studentId: result.studentId,
      notificationType: "submit_answer",
    });

    response.status(200).json({
      message: "Result Changed Successfully",
      result,
      statusCode: 200,
    });
  }
);

export const getTeacherDetails = catchError(async (request, response, next) => {
  let { id } = request.modal;

  const existingTeacher = await TeacherSchema.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!existingTeacher) {
    return next(ErrorMessage(404, "المعلم غير موجود"));
  }
  return response.json({
    teacher: existingTeacher,
  });
});

export const getAllResultFroPendingHomeWork = catchError(
  async (request, response, next) => {
    const results = await ResultSchema.findAll({
      where: { status: "Pending" },
      include: [
        {
          model: StudentSchema,
          attributes: { exclude: ["password"] },
          include: [{ model: ClassSchema }, { model: GroupSchema }],
        },
      ],
    });

    for (let result of results) {
      if (result.examId) {
        const exam = await ExamSchema.findByPk(result.examId);
        result.dataValues.Exam = exam;
      } else if (result.lessonId) {
        const lesson = await LessonSchema.findByPk(result.lessonId);
        result.dataValues.Lesson = lesson;
      }
    }

    if (results.length === 0) {
      return next(ErrorMessage(404, "not found "));
    }
    response.status(200).json({ results, statusCode: 200 });
  }
);

export const getExamResults = catchError(async (request, response, next) => {
  const { examId } = request.params;
  const results = await ResultSchema.findAll({
    where: { examId },
    include: [
      {
        model: StudentSchema,
        include: [
          {
            model: ClassSchema,
            attributes: ["name", "id"],
          },
          { model: GroupSchema, attributes: ["name", "id"] },
        ],
        attributes: { exclude: ["password"] },
      },
      {
        model: ExamSchema,
        attributes: { exclude: ["password"] },
      },
    ],
  });
  if (!results) {
    return next(ErrorMessage(404, "لا يوجد نتائج"));
  }
  return response.status(200).json({ results, statusCode: 200 });
});

export const getStudentById = catchError(async (request, response, next) => {
  let { studentId } = request.params;
  const student = await StudentSchema.findOne({
    where: { id: studentId },
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
