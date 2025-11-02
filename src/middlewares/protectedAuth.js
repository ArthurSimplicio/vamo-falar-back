import { config } from "dotenv"
config()
import jwt from "jsonwebtoken"
import {User} from "../models/User.js"

export const protectedAuth = async (req, res, next) =>{
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({msg: "Token not found!"})
    }
    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select("-password")
        next()
    } catch (error) {
        res.status(401).json({msg: "Token inválido!", error})
    }
}