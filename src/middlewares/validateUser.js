import { User } from "../models/User.js"
export const validateUser = (req, res, next) =>{
    const {name, registration, password} = req.body
    if(!name) return res.status(400).json({msg: "O nome é obrigatório!!!"})
    if(!registration) return res.status(400).json({msg: "A matricula é obrigatória!!!"})
    if(!password) return res.status(400).json({msg: "A senha é obrigatória!!!"})
    if(password.length<6) return res.status(400).json({msg: "Senha muito curta!!!"})
    next()
}

export const checkRegistration = async (req, res, next) => {
    const {registration} = req.body
    const user = await User.findOne({registration})
    if(user) return res.status(400).json({msg: "Essa matricula já está em uso!"})
    next()
}