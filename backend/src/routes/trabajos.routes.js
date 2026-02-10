const express = require("express");
const router = express.Router();

const{
    obtenerTrabajos,
    crearTrabajo,
    obtenerTrabajoPorId,
    editarTrabajo,
    eliminarTrabajo,
    incrementarVisita
} = require("../controllers/trabajos.controllers");

const verificarToken = require("../middleware/verificarToken");


//rutas publicas
router.get("/", obtenerTrabajos);
router.get("/:id", obtenerTrabajoPorId);

//por ahora sin proteccion
router.post("/", verificarToken ,crearTrabajo);
router.put("/:id", verificarToken ,editarTrabajo);
router.delete("/:id", verificarToken ,eliminarTrabajo);
router.post("/:id/visita", incrementarVisita)

module.exports = router;