const pool = require("../config/db");
const { enviarNotificacionNuevoTrabajo } = require("../utils/mailer");

// 1. Obtener todos los trabajos
exports.obtenerTrabajos = async (req, res) => {
    try {
        const result = await pool.query("SELECT *, TO_CHAR(fecha_publicacion, 'DD-MM-YY') as fecha_formateada FROM trabajos ORDER BY destacado DESC, id DESC")
        res.json(result.rows)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// 2. Crear trabajo (Versión final con notificación por correo)
// 2. Crear trabajo (CON DEBUG ESTRATÉGICO)
exports.crearTrabajo = async (req, res) => {
    const fechaAhora = new Date().toLocaleString('es-CL', {
        dateStyle: 'long',
        timeStyle: 'short'
    });

    try {
        // --- DEBUG 1: Ver qué llega al servidor desde el Frontend ---
        console.log("================ DEBUG BACKEND ================");
        console.log("1. BODY COMPLETO:", JSON.stringify(req.body, null, 2));
        console.log("2. VALOR DE 'DESTACADO':", req.body.destacado);
        console.log("3. TIPO DE DATO:", typeof req.body.destacado);

        // 🔐 validación de rol
        if (!req.usuario || req.usuario.role !== "admin") {
            console.log("❌ ERROR: Usuario no es admin");
            return res.status(403).json({ error: "Acceso denegado" });
        }

        const adminInfo = await pool.query("SELECT nombre, email FROM admins WHERE id = $1", [req.usuario.id]);
        const adminNombre = adminInfo.rows[0]?.nombre || "Administrador";
        const adminEmail = adminInfo.rows[0]?.email || "Sin email";

        const {
            titulo, descripcion, sueldo, ubicacion,
            latitud, longitud, imagen_url, contacto_whatsapp, destacado
        } = req.body;

        if (!titulo || !descripcion) {
            console.log("❌ ERROR: Faltan campos obligatorios");
            return res.status(400).json({ error: "El título y la descripción son obligatorios" });
        }

        // --- DEBUG 2: Asegurar el booleano antes de la DB ---
        // Esto convierte "true" (string) o true (booleano) en un booleano real de JS
        const valorParaDB = destacado === true || destacado === "true";
        console.log("4. VALOR FINAL QUE ENTRARÁ A LA QUERY:", valorParaDB);
        console.log("===============================================");

        // Guardar en la DB
        const nuevo = await pool.query(
            `INSERT INTO trabajos (
                titulo, 
                descripcion, 
                sueldo, 
                ubicacion, 
                latitud, 
                longitud, 
                imagen_url, 
                contacto_whatsapp, 
                destacado
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                titulo, 
                descripcion, 
                sueldo || 0, 
                ubicacion || null, 
                latitud || null, 
                longitud || null, 
                imagen_url || null, 
                contacto_whatsapp || '+56956795637', 
                valorParaDB // Aquí enviamos el valor que debugueamos
            ]
        );

        // ✅ ENVIAR CORREO DE NOTIFICACIÓN
        try {
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
        console.error("❌ ERROR CRÍTICO EN EL CONTROLADOR:", error.message);
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
        const { titulo, descripcion, sueldo, ubicacion, latitud, longitud, imagen_url, contacto_whatsapp, destacado } = req.body

        if (req.usuario.role !== "admin") {
            return res.status(403).json({ error: "Acceso denegado" });
        }

        const actualizado = await pool.query(
            `UPDATE trabajos
            SET titulo = $1, descripcion = $2, sueldo = $3, ubicacion = $4, latitud = $5, longitud = $6, imagen_url = $7, contacto_whatsapp = $8, destacado = $9
            WHERE id = $10 RETURNING *`,
            [titulo, descripcion, sueldo, ubicacion, latitud, longitud, imagen_url, contacto_whatsapp, destacado, id]
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