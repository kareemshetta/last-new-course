import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import {
  ClassSchema,
  LessonSchema,
  UnitSchema,
} from "../../../DB/dbConnection.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createLesson = catchError(async (request, response, next) => {
  const { title, unitId } = request.body;

  // check if unit exist
  const existingUnit = await UnitSchema.findOne({ where: { id: unitId } });
  if (!existingUnit) {
    return next(ErrorMessage(404, "Unit Not Found 😥"));
  }
  if (request.files.file) {
    let dest = request.files.file.map((lesson) => lesson.dest);
    request.body.file = dest[0];
  }

  if (request.files.homeworkFile) {
    let dest = request.files.homeworkFile.map((lesson) => lesson.dest);
    request.body.homeworkFile = dest[0];
  }

  if (request.body.homeworkQuestions) {
    const newHomeworkQuestions = [];
    for (let q of request.body.homeworkQuestions) {
      let newQ = JSON.parse(q);
      newHomeworkQuestions.push(newQ);
    }
    request.body.homeworkQuestions = newHomeworkQuestions;
  }

  const newLesson = await LessonSchema.create(request.body);
  response.status(201).json({
    message: "تم اضافة الدرس بنجاح",
    result: newLesson,
    statusCode: 201,
  });
});
export const updateLesson = catchError(async (request, response, next) => {
  const { id, title } = request.params;
  console.log("test", !!request.files);
  const existingLesson = await LessonSchema.findByPk(id);
  const lessonJson = existingLesson.toJSON();
  if (!lessonJson) {
    return next(ErrorMessage(404, "الدرس غير موجود"));
  }

  const body = { ...request.body };

  const unLinkAsync = promisify(fs.unlink);
  if (request.files) {
    if (!!request.files.file) {
      let dest = request.files.file.map((lesson) => lesson.dest);
      body.file = dest[0];
    }
    if (!!lessonJson.file && !!request.files.file) {
      const fullPath = path.join(__dirname, `../../../${lessonJson.file}`);
      await unLinkAsync(fullPath);
    }

    if (!!request.files.homeworkFile) {
      let dest = request.files.homeworkFile.map((lesson) => lesson.dest);
      body.homeworkFile = dest[0];
    }

    if (!!lessonJson.homeworkFile && !!request.files.homeworkFile) {
      const fullPath = path.join(
        __dirname,
        `../../../${lessonJson.homeworkFile}`
      );
      await unLinkAsync(fullPath);
    }
  }
  if (request.body.homeworkQuestions) {
    const newHomeworkQuestions = [];
    for (let q of request.body.homeworkQuestions) {
      let newQ = JSON.parse(q);
      newHomeworkQuestions.push(newQ);
    }
    body.homeworkQuestions = newHomeworkQuestions;
  }

  const updatedLesson = await LessonSchema.update(body, {
    where: { id },
  });

  response.status(201).json({
    message: "تم تعديل الدرس بنجاح",
    result: updatedLesson,
    statusCode: 201,
  });
});

export const getLessons = catchError(async (request, response, next) => {
  const Lessons = await LessonSchema.findAll({
    include: [
      {
        model: UnitSchema,
        attributes: ["id", "name"],
        as: "unit",
        include: [
          {
            model: ClassSchema,
            attributes: ["id", "name"],
            as: "class",
          },
        ],
      },
    ],
  });

  response.status(200).json({
    Lessons,
    statusCode: 200,
  });
});

export const deleteLesson = catchError(async (request, response, next) => {
  const { id } = request.params;
  const unLinkAsync = promisify(fs.unlink);
  const existingLesson = await LessonSchema.findOne({ where: { id } });
  if (!existingLesson) {
    return next(ErrorMessage(404, "الدرس غير موجود"));
  }

  // to remove lesson file if it exists from server
  if (existingLesson.file) {
    const fullPath = path.join(__dirname, `../../../${existingLesson.file}`);
    await unLinkAsync(fullPath);
  }
  // to remove home work file if it exists from server
  if (existingLesson.homeworkFile) {
    const fullPath = path.join(
      __dirname,
      `../../../${existingLesson.homeworkFile}`
    );
    await unLinkAsync(fullPath);
  }

  await LessonSchema.destroy({ where: { id } });
  response.status(200).json({
    message: "تم حذف الدرس بنجاح",
    statusCode: 200,
  });
});

export const getLessonsByUnitId = catchError(
  async (request, response, next) => {
    const { unitId } = request.params;
    const lessons = await LessonSchema.findAll({
      where: {
        unitId,
      },
      include: { model: UnitSchema, as: "unit" },
    });
    response.status(200).json({
      lessons,
      statusCode: 200,
    });
  }
);
