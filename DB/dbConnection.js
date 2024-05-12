import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { createExam } from "../models/Exam.js";
import { createGroup } from "../models/Group.js";
import { createLesson } from "../models/Lesson.js";
import { createStudent } from "../models/Student.js";
import { createTeacher } from "../models/Teacher.js";
import { createUnit } from "../models/Units.js";
import { createClass } from "../models/Class.js";
import { createResult } from "../models/Result.js";
import { createBook } from "../models/Book.js";
import { createGroupExam } from "../models/Group_Exam.js";
import { createNotification } from "../models/Notification.js";
dotenv.config();

// export const sequelize = new Sequelize({
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   dialect: "postgres",
//   port: process.env.DB_PORT,
//   host: process.env.DB_HOST,
//   define: {
//     charset: "utf8",
//     collate: "utf8_general_ci",
//   },
// });

// export const sequelize = new Sequelize(process.env.REMOTE_POSTGRES);
//? all models
export const StudentSchema = createStudent(sequelize);
export const TeacherSchema = createTeacher(sequelize);
export const ClassSchema = createClass(sequelize);
export const GroupSchema = createGroup(sequelize);
export const UnitSchema = createUnit(sequelize);
export const LessonSchema = createLesson(sequelize);
export const ExamSchema = createExam(sequelize);
export const ResultSchema = createResult(sequelize);
export const BookSchema = createBook(sequelize);
export const GroupExamSchema = createGroupExam(sequelize);
export const NotificationSchema = createNotification(sequelize);

//! -------------start relations-----------------------------------//
TeacherSchema.hasMany(StudentSchema);
StudentSchema.belongsTo(TeacherSchema);

ClassSchema.hasMany(StudentSchema, {
  foreignKey: {
    name: "classId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
StudentSchema.belongsTo(ClassSchema, {
  foreignKey: "classId",
});

ClassSchema.hasMany(GroupSchema, {
  foreignKey: {
    name: "classId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
GroupSchema.belongsTo(ClassSchema, {
  foreignKey: "classId",
});

GroupSchema.hasMany(StudentSchema, {
  foreignKey: {
    name: "groupId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
StudentSchema.belongsTo(GroupSchema, {
  foreignKey: "groupId",
});

ClassSchema.hasMany(UnitSchema, {
  foreignKey: {
    name: "classId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
UnitSchema.belongsTo(ClassSchema, {
  foreignKey: "classId",
});

UnitSchema.hasMany(LessonSchema, {
  foreignKey: {
    name: "unitId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
LessonSchema.belongsTo(UnitSchema, {
  foreignKey: "unitId",
});

ClassSchema.hasMany(ExamSchema, {
  foreignKey: {
    name: "classId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
ExamSchema.belongsTo(ClassSchema, {
  foreignKey: "classId",
});

GroupSchema.belongsToMany(ExamSchema, {
  through: "group_exam",
  onDelete: "CASCADE",
});
ExamSchema.belongsToMany(GroupSchema, {
  through: "group_exam",
  onDelete: "CASCADE",
});

StudentSchema.hasMany(ResultSchema, {
  foreignKey: {
    name: "studentId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
ResultSchema.belongsTo(StudentSchema, {
  foreignKey: "studentId",
});

ExamSchema.hasMany(ResultSchema, {
  foreignKey: {
    name: "examId",
    allowNull: true,
  },
  onDelete: "CASCADE",
});

ResultSchema.belongsTo(ExamSchema, {
  foreignKey: "examId",
});

LessonSchema.hasMany(ResultSchema, {
  foreignKey: {
    name: "lessonId",
    allowNull: true,
  },
  onDelete: "CASCADE",
});
ResultSchema.belongsTo(LessonSchema, {
  foreignKey: "examId",
});
ClassSchema.hasMany(BookSchema, {
  foreignKey: {
    name: "classId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
BookSchema.belongsTo(ClassSchema, {
  foreignKey: "classId",
});
StudentSchema.hasMany(NotificationSchema, {
  foreignKey: { name: "studentId", allowNull: true },
});

TeacherSchema.hasMany(NotificationSchema, {
  foreignKey: { name: "teacherId", allowNull: true },
});
NotificationSchema.belongsTo(StudentSchema, {
  foreignKey: { name: "studentId", allowNull: true },
  // constraints: false,
});

NotificationSchema.belongsTo(TeacherSchema, {
  foreignKey: { name: "teacherId", allowNull: true },
});

//! -------------end relations-----------------------------------//
export const initialize = async (app) => {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to MySQL database has been established successfully."
    );
    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server listening on port ${process.env.PORT || 5000}`)
    );
  } catch (e) {
    console.log(e);
  }
};
