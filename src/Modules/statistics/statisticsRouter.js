import express from "express";

import { getStatistics } from "./statisticsController.js";

let router = express.Router();
router.route("/").get(getStatistics);
export default router;
