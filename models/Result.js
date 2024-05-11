import { DataTypes } from "sequelize";

export const createResult = (sequelize) => {
  return sequelize.define("result", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    answerFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
