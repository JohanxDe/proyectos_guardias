const verificarAdmin = (req, res, next) => {
    try{
        if(!req.usuario){
            return res.status(401).json({error: "No autenticado"})
        }

        if(req.usuario.role !== "admin"){
            return res.status(403).json({error: "Acceso denegado. se requiere rol de administrado"})
        }

        next()

    }catch(error){
        return res.status(500).json({error: "Error interno del servidor"})
    };
}

module.exports = verificarAdmin