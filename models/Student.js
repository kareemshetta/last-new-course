import bcrypt from "bcrypt";
import { DataTypes } from "sequelize";

export const createStudent = (sequelize) => {
  return sequelize.define("student", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    phone: { type: DataTypes.STRING, unique: true },
    parentPhoneNumber: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const hashedPassword = bcrypt.hashSync(value, 8);
        this.setDataValue("password", hashedPassword);
      },
    },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },

    profileImage: {
      type: DataTypes.STRING,
      defaultValue: "uploads/profilePic/default_image.png",
      allowNull: true,
    },
  });
};
