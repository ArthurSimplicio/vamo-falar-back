import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { checkRegistration, validateUser } from "../middlewares/validateUser.js";

const authRoutes = Router()
authRoutes.post('/register', validateUser, checkRegistration, AuthController.register)
authRoutes.post('/login', AuthController.login)
export default authRoutes