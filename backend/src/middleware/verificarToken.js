const jwt = require("jsonwebtoken");
require("dotenv").config();

const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token no proporcionado" });
        }

        const token = authHeader.split(" ")[1];

        // Verificamos si el token es válido
        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                return res.status(403).json({ error: "Token inválido o expirado" });
            }

            // Guardamos los datos del usuario para usarlos en el controlador
            req.usuario = decoded;

            next(); // Todo bien → sigue a la ruta
        });

    } catch (error) {
        console.error("Error al verificar token:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = verificarToken;
