const express = require("express");
const router = express.Router();

const{
    obtenerNoticias,
    crearNoticia,
    obtenerNoticiasPorId,
    editarNoticia,
    eliminarNoticia
} = require("../controllers/noticias.controllers")

const verificarToken = require("../middleware/verificarToken");

//rutas publicas
router.get("/", obtenerNoticias);
router.get("/:id", obtenerNoticiasPorId);

router.post("/", verificarToken, crearNoticia);
router.put("/:id", verificarToken, editarNoticia);
router.delete("/:id", verificarToken, eliminarNoticia)

module.exports = router;