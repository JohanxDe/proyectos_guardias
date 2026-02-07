const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {enviarNotificacionNurvoAdmin} = require("../utils/mailer")

require("dotenv").config();

const sanitizarTexto = (texto) => {
    if(typeof texto !== "string") return ""
    return texto.trim().slice(0, 255)//limita la longitud
}

// Registro mejorado con envío de Email
exports.registrarUsuario = async(req, res) => {
    try {
        const { nombre, email, password, role } = req.body;

        // Validación de datos
        if(!nombre || !email || !password){
            return res.status(400).json({error: "Faltan datos obligatorios"})
        };

        // 1. Verificar si ya existe
        const usuarioExistente = await pool.query(
            "SELECT * FROM admins WHERE email = $1",
            [email]
        );

        if(usuarioExistente.rows.length > 0){
            return res.status(400).json({error: "El email ya está registrado"});
        }

        // 2. Hashear la contraseña
        const passwordHash = await bcrypt.hash(password, 10)

        // 3. Insertar en la Base de Datos
        const usuarioNuevo = await pool.query(
            `INSERT INTO admins (nombre, email, password, role)
            VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, role`,
            [nombre, email, passwordHash, role || "admin"]
        );

        // 4. ✅ ENVIAR CORREO (Solo si la inserción fue exitosa)
        // Usamos await para asegurarnos de capturar errores de envío si los hay
        try {
            await enviarNotificacionNuevoAdmin(nombre, email);
        } catch (mailError) {
            console.error("Usuario creado pero el correo falló:", mailError);
            // No bloqueamos la respuesta al cliente, el usuario ya se creó
        }

        res.json({
            message: "Usuario registrado con éxito y notificación enviada",
            usuario: usuarioNuevo.rows[0]
        });

    } catch(error) {
        console.error("Error en registro:", error);
        res.status(500).json({ error: error.message});
    }
};


//Registro
exports.registrarUsuario = async(req, res) => {
    try{
        const {nombre, email, password, role} = req.body;

        if(!nombre || !email || !password){
            return res.status(400).json({error: "faltan datos obligatorios"})
        };

        const usuarioExistente = await pool.query(
            "SELECT * FROM admins WHERE email = $1",
            [email]
        );

        if(usuarioExistente.rows.length > 0){
            return res.status(400).json({error: "El email ya esta registrado"});
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const usuarioNuevo = await pool.query(
        `INSERT INTO admins (nombre, email, password, role)
        VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, role`,
        [nombre, email, passwordHash, role || "admin"]
        );

        res.json({
            message: "Usuario Registrado con exito",
            usuario: usuarioNuevo.rows[0]
        });
    }catch(error){
        res.status(500).json({ error: error.message});
    }
};

//login
exports.login = async (req, res) => {
  try {
    const email = sanitizarTexto(req.body.email)
    const { password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son requeridos" })
    }

    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email])

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" })
    }

    const admin = result.rows[0]
    const passwordOK = await bcrypt.compare(password, admin.password)

    if (!passwordOK) {
      return res.status(401).json({ error: "Credenciales incorrectas" })
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }, // Reducido a 8 horas
    )

    res.json({ message: "Login exitoso", token })
  } catch (error) {
    console.error("Error en login:", error)
    res.status(500).json({ error: "Error al iniciar sesión" })
  }
}

//perfil protegido

exports.obtenerPerfil = async(req, res) => {
    try{

        const usuarioID = req.usuario.id;

        const usuario = await pool.query(
            "SELECT id, nombre, email, role FROM admins WHERE id = $1",
            [usuarioID]
        );

        res.json(usuario.rows[0]);
    }catch(error){
        console.error("Error obteniendo perfil", error)
        res.status(500).json({error: "Error al obtener perfil"})
    }
};