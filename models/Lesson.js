import { DataTypes } from "sequelize";

export const createLesson = (sequelize) => {
  return sequelize.define("lesson", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs for new lessons
    },
    title: {
      type: DataTypes.STRING,
      // unique: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    videoUrl: {
      type: DataTypes.STRING,
    },
    file: {
      type: DataTypes.JSON, // Using JSON to store an array of objects
    },
    homeworkFile: {
      type: DataTypes.JSON, // Using JSON to store an array of objects
    },
    homeworkQuestions: {
      type: DataTypes.JSON, // Using JSON to store an array of objects
    },
    score: { type: DataTypes.DECIMAL },
    questionType: { type: DataTypes.ENUM(["PDF", "MCQ"]) },
    endShowingDate: { type: DataTypes.DATE },
  });
};
