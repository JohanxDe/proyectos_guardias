const express = require("express");
const router = express.Router();

const {
    registrarUsuario,
    login,
    obtenerPerfil
}  = require("../controllers/auth.controllers");

const verificarToken = require("../middleware/verificarToken");


//rutas publicas
router.post("/register", registrarUsuario);
router.post("/login", login);

//rutas protegidas
router.get("/perfil", verificarToken, obtenerPerfil);

module.exports = router;