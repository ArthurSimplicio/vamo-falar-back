import { Router } from "express";
import { UsersController } from "../controllers/UsersController.js";
import { validateUser } from "../middlewares/validateUser.js";
import { protectedAuth } from "../middlewares/protectedAuth.js"; 
import { authorizedRole } from "../middlewares/authorizedRole.js";
const userRoutes = Router()
userRoutes.get('/', UsersController.getAllUsers)
userRoutes.get('/admin/users', protectedAuth, authorizedRole('admin'), UsersController.getAllUsers)
userRoutes.get('/:id', protectedAuth, UsersController.getUser)
userRoutes.put('/:id', protectedAuth, validateUser, UsersController.updateUser)
userRoutes.delete('/:id', protectedAuth, UsersController.deleteUser)
userRoutes.delete('/', UsersController.deleteAllUser)

export default userRoutes