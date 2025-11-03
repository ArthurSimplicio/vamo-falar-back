import bcrypt from "bcrypt"
import {createToken} from "../utils/createToken.js"
import { User } from "../models/User.js"

export class AuthController {
    static async register(req, res) {
        const { name, registration, password, role } = req.body
        try {
            const hash = await bcrypt.genSalt(12)
            const hashedPassword = await bcrypt.hash(password, hash)
            const newUser = new User({ 
                name, 
                registration, 
                password: hashedPassword, 
                role: role || "user"
            })
           
            await newUser.save()
            
            const token = createToken(newUser._id, newUser.name, newUser.registration, newUser.role)
            res.status(201).json({ newUser, token })
        } catch (error) {
            res.status(404).json(error)
        }
    }
    static async login(req, res){
        const {registration, password} = req.body

        if(!registration) return res.status(400).json({msg: "A matricula é obrigatória"})
        if(!password) return res.status(400).json({msg: "A senha é obrigatória"})
        const user = await User.findOne({registration})
        if(!user) return res.status(404).json({msg: "Matricula incorreta!"})
        
        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword) return res.status(404).json({msg: "Senha incorreta!"})
            
        const token = createToken(user._id, user.name, user.registration, user.role)
        res.json({msg: "Login realizado", token, })
    }
}