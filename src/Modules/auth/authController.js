import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StudentSchema, TeacherSchema } from "../../../DB/dbConnection.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";
import { createNotification } from "../../utils/NotificationService.js";
export const register = catchError(async (request, response, next) => {
  const existingUser = await StudentSchema.findOne({
    where: { phone: request.body.phone },
  });

  if (existingUser) {
    return next(ErrorMessage(409, "Account Already Exist"));
  }

  const newStudent = await StudentSchema.create(request.body);

  // Create notification for the teacher
  await createNotification({
    notificationType: "register",
    title: "New Student Registration",
    message: `Student ${newStudent.userName} has registered and needs verification.`,
    recipientType: "Teacher",
    teacherId: request.body.teacherId,
  });

  response.status(201).json({
    message: "Add New Student Successfully",
    statusCode: 200,
    result: newStudent,
  });
});

export const login = catchError(async (request, response, next) => {
  const { phone, password } = request.body;
  const student = await StudentSchema.findOne({
    where: { phone },
    include: [
      {
        model: TeacherSchema,
        attributes: ["facebookUrl", "whatsappUrl"], // Only include facebookUrl and whatsappUrl attributes
      },
    ],
  });

  console.log({
    student: student?.verified,
  });
  if (student && !student?.verified) {
    return next(ErrorMessage(401, "Please Verify Your Account 🙄"));
  }

  const match = await bcrypt.compare(password, student ? student.password : "");
  const studentJson = student.toJSON();
  if (match) {
    let token = jwt.sign(
      {
        ...studentJson,
      },
      process.env.SECRET_KEY
    );
    return response.status(200).json({
      statusCode: 200,
      token,
    });
  }
  next(ErrorMessage(401, "Incorrect Phone Or Password 🙄"));
});
