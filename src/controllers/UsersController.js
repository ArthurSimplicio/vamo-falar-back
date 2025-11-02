import bcrypt from 'bcrypt'
import { User } from "../models/User.js"
import { createToken } from '../utils/createToken.js'


export class UsersController{
    static async getAllUsers(req, res){
        const users = await User.find()     
        res.json(users)
    }
    static async getUser(req, res){
        const {id} = req.params
        const user = await User.findById(id)
        console.log(user)
        if(!user) return res.status(404).json({msg: "User not found!"})
         res.json({...user, password: ""})
    }
    static async updateUser(req, res){
        const {id} = req.params
        const {name, registration, password, role} = req.body

        const user = await User.findById(id)

        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) return res.json({ msg: "Wrong password" })
        
        if(!user) return res.status(404).json({msg: "User not found!"})
        user.registration = registration || user.registration
        user.name = name || user.name
        user.role = role || user.role
        await user.save()
        res.json({user, password: ""})
    }
    static async deleteUser(req, res){
        const {id} = req.params
        const index = await User.findByIdAndDelete(id)
        if(index === -1) return res.status(404).json({msg: "User not found!"})
        res.json({msg: "User was delected"})
    }
    static async deleteAllUser(req, res){
        await User.deleteMany({})
        res.json({msg: "All uses were deleted"})
    }

}