import { DataTypes } from "sequelize";

export const createGroupExam = (sequelize) => {
  return sequelize.define("group_exam", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
  });
};
