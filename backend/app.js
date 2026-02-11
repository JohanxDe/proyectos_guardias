const express = require('express');
const cors = require('cors');

const trabajosRoutes = require('./src/routes/trabajos.routes');
const noticiasRoutes = require('./src/routes/noticias.routes');
const authRoutes = require('./src/routes/auth.routes'); 

const app = express();
app.set('trust proxy', 1);

app.use(cors({
  origin: 'https://proyectos-guardias-1.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

//Rutas base
app.get('/', (req, res) => res.json({message: 'API seguridad_trabajos ok'}));

//montar rutas, hay que crearlas (para despues)


app.use("/api/trabajos", trabajosRoutes);
app.use("/api/noticias", noticiasRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;