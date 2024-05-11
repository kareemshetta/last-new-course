import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";

import {
  ClassSchema,
  ExamSchema,
  GroupExamSchema,
  GroupSchema,
  sequelize,
} from "../../../DB/dbConnection.js";
import { QueryTypes } from "sequelize";
export const createExam = catchError(async (request, response, next) => {
  const { title, questionType, groupsId, examType } = request.body;
  const existingExam = await ExamSchema.findOne({ where: { title } });
  if (existingExam) {
    return next(ErrorMessage(409, "Exam Already Exist 🙄"));
  }
  if (questionType == "PDF" && request.file) {
    let { dest } = request.file;
    request.body.file = dest;
  }
  const body = { ...request.body };
  delete body.groupsId;
  const newExam = await ExamSchema.create(body);

  if (examType != "COMPETITION") {
    const bulkObject = groupsId.map((item) => ({
      examId: newExam.id,
      groupId: item,
    }));
    await GroupExamSchema.bulkCreate([...bulkObject]);
  }
  response.status(201).json({
    message: "Add New Exam Successfully 😃",
    result: newExam,
  });
});

export const getExams = catchError(async (request, response, next) => {
  const { title, unitId } = request.body;
  const { examType } = request.query; // COMPETITION , EXAM
  let exams;
  if (examType) {
    exams = await ExamSchema.findAll({
      where: { examType },
      include: { model: ClassSchema, attributes: ["id", "name"], as: "class" },
    });
  } else {
    exams = await ExamSchema.findAll({
      include: { model: ClassSchema, attributes: ["id", "name"], as: "class" },
    });
  }

  if (!exams) {
    return next(ErrorMessage(409, "Exam Already Exist 🙄"));
  }

  response.status(201).json({
    message: "success😃",
    result: exams,
  });
});
export const getCompetitionExamsByClassId = catchError(
  async (request, response, next) => {
    let exams = await ExamSchema.findAll({
      where: { examType: "COMPETITION", classId: request.params.classId },
      include: { model: ClassSchema, attributes: ["id", "name"], as: "class" },
    });

    if (!exams) {
      return next(ErrorMessage(409, "Not Found Exam"));
    }
    response.status(201).json({
      result: exams,
    });
  }
);

export const deleteExam = catchError(async (request, response, next) => {
  let { id } = request.params;
  let result = await ExamSchema.destroy({ where: { id } }); // return 0 , 1
  if (!result) {
    return next(ErrorMessage(404, `Exam Not Found 😥`));
  }
  response.status(200).json({
    message: "Delete Successfully 🤝",
  });
});

export const getAllExamByClassIdAndGroupId = catchError(
  async (request, response, next) => {
    // let { groupId } = request.params;
    // const allExam = await GroupExamSchema.findAll({
    //   where: { groupId },
    //   include: { model: ExamSchema, as: "exams" },
    // });
    // if (!allExam) {
    //   return next(ErrorMessage(404, `Exam Not Found 😥`));
    // }
    // response.status(200).json({
    //   allExam,
    // });

    const { groupId } = request.params;
    const isGroupExist = await GroupSchema.findOne({ id: groupId });
    console.log(isGroupExist);
    if (!isGroupExist) {
      return next(ErrorMessage(404, `Group Not Found 😥`));
    }

    // Assuming groupId is a route parameter
    const groupExams = await sequelize.query(
      `SELECT group_exams."id",
group_exams."createdAt",
group_exams."updatedAt",
"groupId", "examId" ,exams."title",
exams."file",exams."description",exams."questions",exams."score",exams."language",exams."startTime",
exams."questionType",
exams."duration",
groups."name"
	FROM public.group_exams  join groups on group_exams."groupId"=groups."id"
	join exams on exams."id"=group_exams."examId"
	where group_exams."groupId"=?;`,

      {
        replacements: [groupId],
        type: QueryTypes.SELECT,
      }
    );
    // const groupExams = await GroupExamSchema.findAll({
    //   attributes: ["id", "createdAt", "updatedAt"], // Attributes from GroupExam
    //   where: { groupId: groupId }, // Filter by groupId taken from the request
    //   include: [
    //     {
    //       model: GroupSchema,
    //       attributes: ["name"], // Only get the name from Group
    //     },
    //     {
    //       model: ExamSchema,
    //       attributes: ["title"], // Only get the title from Exam
    //     },
    //   ],
    // });

    if (groupExams && groupExams.length) {
      response.status(200).json(groupExams);
    } else {
      return next(ErrorMessage(404, `No Exams Found For This Group 😥`));
    }
  }
);
