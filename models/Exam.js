import { DataTypes } from "sequelize";

export const createExam = (sequelize) => {
  return sequelize.define("exam", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    examType: { type: DataTypes.ENUM(["EXAM", "HOMEWORK", "COMPETITION"]) },
    questionType: { type: DataTypes.ENUM(["PDF", "MCQ"]) },
    title: { type: DataTypes.STRING },
    file: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    language: { type: DataTypes.ENUM(["English", "Arabic"]) },
    duration: { type: DataTypes.STRING },
    startTime: { type: DataTypes.DATE },
    score: { type: DataTypes.DECIMAL },
    questions: { type: DataTypes.JSON },
    status: { type: DataTypes.STRING, defaultValue: "inactive" },
  });
};
