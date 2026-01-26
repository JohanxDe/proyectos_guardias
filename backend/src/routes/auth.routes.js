const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit")

const {
    registrarUsuario,
    login,
    obtenerPerfil
}  = require("../controllers/auth.controllers");

const verificarToken = require("../middleware/verificarToken");
const verificarAdmin = require("../middleware/verificarAdmin");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutos
    max:5, //maximo 5 intentos de login
    message: {error: "Demasiados intentos de login, intenta en 15 minutos"},
    standardHeaders: true,
    legacyHeaders: false,
})

//rutas publicas
router.post("/register", registrarUsuario, verificarAdmin, verificarToken);
router.post("/login",loginLimiter, login);

//rutas protegidas
router.get("/perfil", verificarToken, obtenerPerfil);

module.exports = router;