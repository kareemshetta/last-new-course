import { DataTypes } from "sequelize";

export const createBook = (sequelize) => {
  return sequelize.define("book", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs for new lessons
    },
    title: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    cover: {
      type: DataTypes.STRING,
    },
    file: {
      type: DataTypes.STRING, // Using JSON to store an array of objects
    },
  });
};
