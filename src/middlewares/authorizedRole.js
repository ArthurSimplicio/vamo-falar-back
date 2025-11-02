export const authorizedRole = (...permitedRoles) =>{
    return(req, res, next) => {
        if (!req.user) {
      return res.status(401).json({ msg: "Usuário não autenticado!" });
    }
        if(!permitedRoles.includes(req.user.role)){
            return res.status(403).json({msg: "Access denied: you're not a admin"})
        }
        next()
    }
}