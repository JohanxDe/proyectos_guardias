const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

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
exports.login = async (req, res) =>{
    try{
        const {email, password} = req.body;

        const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);

        if(result.rows.length === 0){
            return res.status(400).json({error: "Credenciales incorrectas"});
        }

        const admin = result.rows[0];
        const passwordOK = await bcrypt.compare(password, admin.password);

        if(!passwordOK){
            return res.status(400).json({error:"Credenciales incorrectas"})
        }

        const token = jwt.sign(
            {id: admin.id, role: admin.role},
            process.env.JWT_SECRET,
            {expiresIn:"24h"}
        );

        res.json({message: "Login exitoso", token});
    }catch(error){
        res.status(500).json({error: error.message})
    }
};

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
        res.status(500).json({error: error.message})
    }
};