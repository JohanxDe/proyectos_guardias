const pool = require("../config/db");
const { enviarNotificacionNuevoTrabajo } = require("../utils/mailer");

// 1. Obtener todos los trabajos
exports.obtenerTrabajos = async (req, res) => {
    try {
        const result = await pool.query("SELECT *, TO_CHAR(fecha_publicacion, 'DD-MM-YY') as fecha_formateada FROM trabajos ORDER BY id DESC")
        res.json(result.rows)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// 2. Crear trabajo (Versión final con notificación por correo)
exports.crearTrabajo = async (req, res) => {
    const fechaAhora = new Date().toLocaleString('es-CL', {
        dateStyle: 'long',
        timeStyle: 'short'
    });

    try {
        // 🔐 validación de rol
        if (!req.usuario || req.usuario.role !== "admin") {
            return res.status(403).json({ error: "Acceso denegado" });
        }
        const adminInfo = await pool.query("SELECT nombre, email FROM usuarios WHERE id = $1", [req.usuario.id]);
        const adminNombre = adminInfo.rows[0]?.nombre || "Administrador";
        const adminEmail = adminInfo.rows[0]?.email || "Sin email";


        const {
            titulo, descripcion, sueldo, ubicacion,
            latitud, longitud, imagen_url, contacto_whatsapp
        } = req.body;

        if (!titulo || !descripcion) {
            return res.status(400).json({ error: "El título y la descripción son obligatorios" });
        }

        // Guardar en la DB
        const nuevo = await pool.query(
            `INSERT INTO trabajos (titulo, descripcion, sueldo, ubicacion, latitud, longitud, imagen_url, contacto_whatsapp)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [titulo, descripcion, sueldo || null, ubicacion || null, latitud || null, longitud || null, imagen_url || null, contacto_whatsapp || '+56992757448']
        );

        // ✅ ENVIAR CORREO DE NOTIFICACIÓN
        try {
            // Llamamos a la función de Resend que creamos arriba
            await enviarNotificacionNuevoTrabajo(
                adminNombre,
                adminEmail,
                titulo,
                ubicacion,
                sueldo,
                nuevo.rows[0].id
            );
        } catch (mailError) {
            console.error("Error al enviar el correo:", mailError);
        }

        res.json({
            message: "Trabajo creado con éxito",
            trabajo: nuevo.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Obtener un trabajo por ID
exports.obtenerTrabajoPorId = async (req, res) => {
    res.set({
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
    })

    try {
        const { id } = req.params;
        const resultado = await pool.query("SELECT * FROM trabajos WHERE id = $1", [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: "Trabajo no encontrado" })
        }
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

// 4. Editar un trabajo
exports.editarTrabajo = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, sueldo, ubicacion, latitud, longitud, imagen_url, contacto_whatsapp } = req.body

        if (req.usuario.role !== "admin") {
            return res.status(403).json({ error: "Acceso denegado" });
        }

        const actualizado = await pool.query(
            `UPDATE trabajos
            SET titulo = $1, descripcion = $2, sueldo = $3, ubicacion = $4, latitud = $5, longitud = $6, imagen_url = $7, contacto_whatsapp = $8
            WHERE id = $9 RETURNING *`,
            [titulo, descripcion, sueldo, ubicacion, latitud, longitud, imagen_url, contacto_whatsapp, id]
        );

        res.json({
            message: "Trabajo actualizado con exito",
            trabajo: actualizado.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Eliminar trabajo
exports.eliminarTrabajo = async (req, res) => {
    try {
        const { id } = req.params
        if (req.usuario.role !== "admin") {
            return res.status(403).json({ error: "Acceso denegado" });
        }
        await pool.query("DELETE FROM trabajos WHERE id = $1", [id]);
        res.json({ message: "trabajo eliminado" })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. Incrementar contador de visitas
exports.incrementarVisita = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "UPDATE trabajos SET visitas = COALESCE(visitas, 0) + 1 WHERE id = $1 RETURNING visitas",
            [id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Trabajo no encontrado" });
        }
        
        res.json({ mensaje: "Visita registrada", visitas: result.rows[0].visitas });
    } catch (error) {
        console.error("Error al incrementar visita: ", error)
        res.status(500).json({ error: "Error interno del servidor" })
    }
}