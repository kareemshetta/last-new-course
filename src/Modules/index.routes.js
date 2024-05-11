import authRoute from "./auth/authRoute.js";
import studentRoute from "./student/studentRoute.js";
import { ErrorMessage } from "../utils/ErrorMessage.js";
import classRoute from "./class/classRoute.js";
import groupRoute from "./group/groupRoute.js";
import unitRoute from "./unit/unitRoute.js";
import lessonRoute from "./lesson/lessonRoute.js";
import examRoute from "./exam/examRoute.js";
import teacherRoute from "./teacher/teacherRoute.js";
import bookRoute from "./book/bookRoute.js";
import statisticsRoute from "./statistics/statisticsRouter.js";
import notifRoute from "./notifications/notificationRoute.js";
export function allRoutes(app) {
  app.get("/", (req, res, next) => {
    res.status(200).json({ message: "wellcome to course center" });
  });
  app.use(authRoute);
  app.use("/student", studentRoute);
  app.use("/class", classRoute);
  app.use("/group", groupRoute);
  app.use("/unit", unitRoute);
  app.use("/lesson", lessonRoute);
  app.use("/exam", examRoute);
  app.use("/teacher", teacherRoute);
  app.use("/book", bookRoute);
  app.use("/statistics", statisticsRoute);
  app.use("/notifications", notifRoute);

  //! Not Found Page
  app.use((request, response, next) => {
    next(ErrorMessage(404, `Not found - ${request.originalUrl}`));
  });

  //! to catch any error
  app.use((error, request, response, next) => {
    console.log(error);
    response.status(error.status || 500).json({
      error: error.message,
      statusError: error.status,
    });
  });
}
