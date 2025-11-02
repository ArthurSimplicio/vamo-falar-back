import { config } from "dotenv"
import jwt from "jsonwebtoken"
config()

export const createToken = (id, name, registration, role) => {
    return jwt.sign({id, name, registration, role}, process.env.JWT_SECRET, {expiresIn: '1d'})
}