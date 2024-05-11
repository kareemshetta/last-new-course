import { DataTypes } from "sequelize";

export const createClass = (sequelize) => {
  return sequelize.define("class", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: { type: DataTypes.STRING, unique: true },
  });
};
