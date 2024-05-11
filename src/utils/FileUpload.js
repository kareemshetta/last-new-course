import multer from "multer";
import fs from "fs";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import {
  ClassSchema,
  ExamSchema,
  LessonSchema,
  UnitSchema,
} from "../../DB/dbConnection.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const fileValidation = {
  image: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/jpg",
    "image/svg+xml",
    "image/bmp",
    "image/webp",
    "image/tiff",
    "image/apng",
    "image/x-icon",
    "image/vnd.microsoft.icon",
    "image/heif",
    "image/heic",
    "image/jp2",
    "image/jxr",
    "image/pjpeg",
    "image/x-jng",
  ],
  file: ["application/pdf", "application/msword"],
  imageOrFile: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/jpg",
    "image/svg+xml",
    "application/pdf",
    "application/msword",
  ],
  video: ["video/mp4"],
  messages: [
    "application/x-msdownload",
    "application/x-dll",
    "text/javascript",
    "text/html",
    "text/htm",
  ],
};
export function fileUpload(
  customPath = "general",
  customValidation = [],
  nested = false
) {
  const nestedStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const { classId, examId, lessonId } = req.body;
      let name = "fallback";
      try {
        if (classId) {
          const classf = await ClassSchema.findOne({ where: { id: classId } });
          if (classf) {
            name = classf.name;
            req.name = classf.name;
          } else {
            req.name = name;
          }
        }
        if (lessonId) {
          const lesson = await LessonSchema.findOne({
            where: { id: lessonId },
            include: [
              {
                model: UnitSchema,
                as: "unit",
                include: { model: ClassSchema, as: "class" }, // Select specific fields from the associated model
              },
            ],
          });

          name = lesson.unit.class.name;
          req.name = lesson.unit.class.name;
        }
        if (examId) {
          const exam = await ExamSchema.findOne({
            where: { id: examId },
            include: [
              {
                model: ClassSchema,
                as: "class",
                // Select specific fields from the associated model
              },
            ],
          });

          name = exam.class.name;
          req.name = exam.class.name;
        }
        console.log("mama", name);
        const fullPath = path.join(
          __dirname,
          `../../uploads/${name}/${customPath}`
        );
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
        }
        cb(null, fullPath);
      } catch (err) {
        console.log("Error creatin", err);
        const fullPath = path.join(
          __dirname,
          `../../uploads/${name}/${customPath}`
        );
        cb(err, fullPath);
      }
    },
    filename: (req, file, cb) => {
      const { name } = req;
      console.log("name", name);
      const uniqueFileName = nanoid() + "_" + file.originalname;
      file.dest = `uploads/${name||"fallback"}/${customPath}/${uniqueFileName}`;
      cb(null, uniqueFileName);
    },
  });
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const fullPath = path.join(__dirname, `../../uploads/${customPath}`);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const uniqueFileName = nanoid() + "_" + file.originalname;
      file.dest = `uploads/${customPath}/${uniqueFileName}`;
      cb(null, uniqueFileName);
    },
  });
  function fileFilter(req, file, cb) {
    if (customValidation.length === 5) {
      if (!customValidation.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb("In-valid file format", false);
      }
    } else {
      if (customValidation.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb("In-valid file format", false);
      }
    }
  }

  const upload = multer({
    fileFilter,
    storage: nested ? nestedStorage : storage,
    limits: {
      fileSize: 250 * 1024 * 1024, // 250MB in bytes
    },
  });
  return upload;
}
