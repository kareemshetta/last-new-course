import express from "express";
import { login, register } from "./authController.js";
import { validation } from "../../Middlewares/validation.js";
import * as validators from "../../Middlewares/Validations/authValidation.js";
let router = express.Router();
router.post("/register", validation(validators.register), register);
router.post("/login", validation(validators.login), login);
export default router;
