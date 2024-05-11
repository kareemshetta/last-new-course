import express from "express";
import * as validators from "../../Middlewares/Validations/bookValidation.js";
import { validation } from "../../Middlewares/validation.js";
import {
  createBook,
  updateBook,
  deleteBook,
  getBooks,
  getSingleBook,
  getAllBooksByClassId,
} from "./bookController.js";
import { fileUpload } from "../../utils/FileUpload.js";
import { fileValidation } from "../../utils/FileUpload.js";
let router = express.Router();
router
  .route("/")
  .get(getBooks)
  .post(
    fileUpload("book", fileValidation.imageOrFile, true).fields([
      { name: "cover" },
      { name: "pdf" },
    ]),
    validation(validators.createBook),
    createBook
  );

router.route("/:classId").get(getAllBooksByClassId);

router
  .route("/:id")
  .get(validation(validators.getBook), getSingleBook)
  .patch(
    fileUpload("book", fileValidation.imageOrFile, true).fields([
      { name: "cover" },
      { name: "pdf" },
    ]),
    validation(validators.updateBook),
    updateBook
  )
  .delete(validation(validators.getBook), deleteBook);
export default router;
