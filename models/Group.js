import { DataTypes } from "sequelize";

export const createGroup = (sequelize) => {
  return sequelize.define("group", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: { type: DataTypes.STRING },
  });
};
