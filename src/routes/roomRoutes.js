import { Router } from "express";
import { protectedAuth } from "../middlewares/protectedAuth.js";
import RoomController from "../controllers/RoomController.js";

const roomRoutes = Router()

roomRoutes.get("/myrooms", protectedAuth, RoomController.getUserRoom)
roomRoutes.post("/create", protectedAuth, RoomController.createRoom)

export default roomRoutes