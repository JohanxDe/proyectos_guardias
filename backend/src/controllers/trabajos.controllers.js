const pool = require("../config/db");


//obtener todos los trabajos
exports.obtenerTrabajos = async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM trabajos ORDER BY id DESC")
        res.json(result.rows)
    }catch(error){
        res.status(500).json({error: error.message});
    }
}


//crear trabajo
exports.crearTrabajo = async (req, res) => {
    try {
        // 🔐 validación de rol
        if (!req.usuario || req.usuario.role !== "admin") {
            return res.status(403).json({ error: "Acceso denegado" });
        }

        const { titulo, descripcion, imagen_url } = req.body;

        if (!titulo || !descripcion) {
            return res.status(400).json({
                error: "El título y la descripción son obligatorios"
            });
        }

        const nuevo = await pool.query(
            `INSERT INTO trabajos (titulo, descripcion, imagen_url)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [titulo, descripcion, imagen_url || null]
        );

        res.json({
            message: "Trabajo creado con éxito",
            trabajo: nuevo.rows[0]
        });

    } catch (error) {
        console.error("Error crearTrabajo:", error);
        res.status(500).json({ error: error.message });
    }
};


// Obtener un trabajo por ID
exports.obtenerTrabajoPorId = async (req, res) =>{
    res.set({
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
    })

    try{
        const{id} = req.params;

        const resultado = await pool.query(
            "SELECT * FROM trabajos WHERE id = $1",
            [id]
        );

        if(resultado.rows.length === 0){
            return res.status(404).json({error: "Trabajo no encontrado"})
        }

        res.json(resultado.rows[0]);
    }catch(error){
        res.status(500).json({error: error.message})
    }
};

//editar un trabajo
exports.editarTrabajo = async (req, res) => {
    try{
        const { id } = req.params;
        const { titulo, descripcion, imagen_url } = req.body

        if (req.usuario.role !== "admin") {
            return res.status(403).json({ error: "Acceso denegado" });
        }


        const actualizado = await pool.query(
            `UPDATE trabajos
            SET titulo = $1, descripcion = $2, imagen_url = $3
            WHERE id = $4 RETURNING *`,
            [titulo, descripcion, imagen_url, id]
        );

        res.json({
            message: "Trabajo actualizado con exito",
            trabajo: actualizado.rows[0]
        });
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

//Elimiar trabajo
exports.eliminarTrabajo = async(req, res) => {
    try{
        const { id } = req.params

        if (req.usuario.role !== "admin") {
            return res.status(403).json({ error: "Acceso denegado" });
        }


        await pool.query("DELETE FROM trabajos WHERE id = $1", [id]);

        res.json({message: "trabajo eliminado"})
    }catch(error){
        res.status(500).json({error: error.message});
    }
};