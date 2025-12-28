const express = require("express");
const router = express.Router();

const{
    obtenerTrabajos,
    crearTrabajo,
    obtenerTrabajoPorId,
    editarTrabajo,
    eliminarTrabajo
} = require("../controllers/trabajos.controllers");

const verificarToken = require("../middleware/verificarToken");


//rutas publicas
router.get("/", obtenerTrabajos);
router.get("/:id", obtenerTrabajoPorId);

//por ahora sin proteccion
router.post("/", verificarToken ,crearTrabajo);
router.put("/:id", verificarToken ,editarTrabajo);
router.delete("/:id", verificarToken ,eliminarTrabajo);

module.exports = router;