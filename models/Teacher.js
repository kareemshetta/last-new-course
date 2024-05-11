import bcrypt from "bcrypt";
import { DataTypes } from "sequelize";

export const createTeacher = (sequelize) => {
  return sequelize.define(
    "teacher",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: { type: DataTypes.STRING },
      lastName: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING, unique: true },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          const hashedPassword = bcrypt.hashSync(value, 8);

          this.setDataValue("password", hashedPassword);
        },
      },
      profileImage: {
        type: DataTypes.STRING,
        defaultValue: "uploads/profilePic/default_image.png",
        allowNull: true,
      },
      facebookUrl: { type: DataTypes.STRING, defaultValue: "" },
      whatsappUrl: { type: DataTypes.STRING, defaultValue: "" },
    }
    // {
    //   hooks: {
    //     beforeCreate: async (user) => {
    //       const hashedPassword = await bcrypt.hash(user.password, 8);
    //       user.password = hashedPassword;
    //     },
    //   },
    // }
  );
};
