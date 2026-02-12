const pool = require("../config/db")

//obtener Todas las noticas 
exports.obtenerNoticias = async (req, res) =>{
    try{
        const result = await pool.query("SELECT * FROM noticias ORDER BY id DESC");
        res.json(result.rows);
    }catch(error){
        res.status(500).json({error: error.message});
    }
};


//Crear una noticia
exports.crearNoticia = async (req, res) => {
    if (req.usuario.role !== "admin") {
        return res.status(403).json({ error: "Acceso denegado" });
    }

    try {
        // AÑADIMOS categoria aquí
        const { titulo, descripcion, imagen_url, categoria } = req.body;

        if (!titulo || !descripcion) {
            return res.status(400).json({
                error: "El título y la descripción son obligatorios"
            });
        }

        const nueva = await pool.query(
            `INSERT INTO noticias (titulo, descripcion, imagen_url, categoria)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [titulo, descripcion, imagen_url || null, categoria || "General"]
        );

        res.status(201).json({
            message: "Noticia creada correctamente",
            noticia: nueva.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// obtener noticias por Id
exports.obtenerNoticiasPorId = async (req, res) => {
    try{
        const { id } = req.params;

        const resultado = await pool.query(
            "SELECT * FROM noticias WHERE id = $1",
            [id]
        );

        if(resultado.rows.length === 0){
            return res.status(404).json({ error: "Noticia no encontrada"});
        }

        res.json(resultado.rows[0])
    }catch(error){
        res.status(500).json({error: error.message})
    }
};

//editar notica
exports.editarNoticia = async (req, res) => {
    if (req.usuario.role !== "admin") {
        return res.status(403).json({ error: "Acceso denegado" });
    }

    try {
        const { id } = req.params;
        const { titulo, descripcion, imagen_url, categoria } = req.body; // AÑADIMOS categoria

        const actualizada = await pool.query(
            `UPDATE noticias
            SET titulo = $1, descripcion = $2, imagen_url = $3, categoria = $4
            WHERE id = $5 RETURNING *`,
            [titulo, descripcion, imagen_url, categoria, id]
        );

        if (actualizada.rows.length === 0) {
            return res.status(404).json({ error: "noticia no encontrada" });
        }

        res.json({
            message: "noticia actualizada",
            noticia: actualizada.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//eliminar noticia
exports.eliminarNoticia = async (req, res) => {

    

    try{
        const { id } = req.params;

        if (req.usuario.role !== "admin") {
        return res.status(403).json({ error: "Acceso denegado" });
    }

        await pool.query("DELETE FROM noticias WHERE id = $1", [id]);

        res.json({message: "Noticia Eliminada"});
    }catch(error){
        res.status(500).json({error: error.message});
    }
};