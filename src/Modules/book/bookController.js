import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";
import { ClassSchema, BookSchema } from "../../../DB/dbConnection.js";
import { Op } from "sequelize";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const createBook = catchError(async (request, response, next) => {
  const { title, classId } = request.body;
  // check if unit exist
  const existingClass = await ClassSchema.findByPk(classId);
  if (!existingClass) {
    return next(ErrorMessage(404, "Class Not Found 😥"));
  }
  // check if book exist
  const existingBook = await BookSchema.findOne({ where: { title } });
  if (existingBook) {
    return next(ErrorMessage(409, "Book Already Exist 🙄"));
  }

  // for pdf file
  let dest = request.files.pdf.map((lesson) => lesson.dest);
  request.body.file = dest[0];
  // for cover image
  let dest2 = request.files.cover.map((lesson) => lesson.dest);
  request.body.cover = dest2[0];

  const newBook = await BookSchema.create(request.body);
  response.status(201).json({
    message: "Add New Book Successfully 😃",
    book: newBook,
  });
});

export const updateBook = catchError(async (request, response, next) => {
  const { title, classId } = request.body;
  const { id } = request.params;

  const unLinkAsync = promisify(fs.unlink);
  const existingBook = await BookSchema.findByPK(id);
  if (!existingBook) {
    return next(ErrorMessage(404, "Book Not Found 😥"));
  }
  if (title) {
    const existingBookWithSomeTitle = await BookSchema.findOne({
      where: { id: { [Op.ne]: id }, title },
    });

    if (existingBookWithSomeTitle) {
      return next(ErrorMessage(409, "Book  With This Title Already Exist 🙄"));
    }
  }

  const existingClass = await ClassSchema.findByPk(classId);
  if (!existingClass) {
    return next(ErrorMessage(404, "Class Not Found 😥"));
  }

  if (request.files.pdf) {
    // if send new file delete old file from server
    const fullPath = path.join(__dirname, `../../../${existingBook.file}`);
    await unLinkAsync(fullPath);
    let dest = request.files.pdf.map((lesson) => lesson.dest);
    request.body.file = dest[0];
  }
  if (request.files.cover) {
    // if send new cover delete old cover from server
    const fullPath = path.join(__dirname, `../../../${existingBook.cover}`);
    await unLinkAsync(fullPath);
    let dest2 = request.files.cover.map((lesson) => lesson.dest);
    request.body.cover = dest2[0];
  }

  await BookSchema.update(request.body, { where: { id } }, { returning: true });
  response.status(201).json({
    message: "Book Updated Successfully 😃",
  });
});

export const deleteBook = catchError(async (request, response, next) => {
  const { id } = request.params;
  const unLinkAsync = promisify(fs.unlink);
  const existingBook = await BookSchema.findByPk(id);
  if (!existingBook) {
    return next(ErrorMessage(404, "Book Not Found 😥"));
  }

  if (existingBook.file) {
    const fullPath = path.join(__dirname, `../../../${existingBook.file}`);
    await unLinkAsync(fullPath);
  }
  if (existingBook.cover) {
    const fullPath = path.join(__dirname, `../../../${existingBook.cover}`);
    await unLinkAsync(fullPath);
  }

  await BookSchema.destroy({
    where: { id },
  });
  response.status(201).json({
    message: "Book deleted Successfully 😃",
  });
});
export const getBooks = catchError(async (request, response, next) => {
  const existingBooks = await BookSchema.findAll({
    include: {
      model: ClassSchema,
      attributes: ["name"],
      as: "class",
    },
  });
  if (!existingBooks) {
    return next(ErrorMessage(409, "Lesson Already Exist 🙄"));
  }

  response.status(201).json({
    message: "Success 😃",
    allBooks: existingBooks,
  });
});

export const getSingleBook = catchError(async (request, response, next) => {
  const { id } = request.params;
  // check if unit exist
  const existingBook = await BookSchema.findOne({
    where: { id },
    include: {
      model: ClassSchema,
      attributes: ["name"],
      as: "class",
    },
  });
  if (!existingBook) {
    return next(ErrorMessage(404, "Book Not Found 😥"));
  }
  return response.status(200).json({ message: "success", book: existingBook });
});

export const getAllBooksByClassId = catchError(
  async (request, response, next) => {
    const { classId } = request.params;
    const allBooks = await BookSchema.findAll({
      where: { classId },
      include: { model: ClassSchema, as: "class" },
    });
    if (!allBooks) {
      return next(ErrorMessage(404, `Book Not Found 😥`));
    }
    response.status(200).json({
      allBooks,
    });
  }
);
