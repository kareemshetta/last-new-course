import { DataTypes } from "sequelize";

export const createUnit = (sequelize) => {
  return sequelize.define("unit", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: { type: DataTypes.STRING },
  });
};
