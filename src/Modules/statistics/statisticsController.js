import { Sequelize } from "sequelize";
import {
  ClassSchema,
  GroupSchema,
  StudentSchema,
  UnitSchema,
} from "../../../DB/dbConnection.js";
import { catchError } from "../../utils/catchAsyncError.js";

export const getStatistics = catchError(async (request, response, next) => {
  const classes = await ClassSchema.findAll({
    attributes: {
      include: [
        // Using COUNT(DISTINCT ...) to ensure only distinct IDs are counted
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.fn("DISTINCT", Sequelize.col("units.id"))
          ),
          "unitsCount",
        ],
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.fn("DISTINCT", Sequelize.col("groups.id"))
          ),
          "groupsCount",
        ],
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.fn("DISTINCT", Sequelize.col("students.id"))
          ),
          "studentsCount",
        ],
      ],
    },
    include: [
      {
        model: UnitSchema,
        as: "units", // Correct alias if defined in association
        attributes: [],
        duplicating: false,
      },
      {
        model: GroupSchema,
        as: "groups", // Correct alias if defined in association
        attributes: [],
        duplicating: false,
      },
      {
        model: StudentSchema,
        as: "students", // Correct alias if defined in association
        attributes: [],
        duplicating: false,
      },
    ],
    group: [Sequelize.col("class.id")], // Correctly referencing the primary key with table alias
  });

  response.status(200).json({ classes });
});
