const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { pool } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try{
        //probar coneccion a DB
        await pool.query('SELECT 1');
        console.log('conexion a postgres exitosa');

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el en puerto: ${PORT}`)
        });
    }catch (err){
        console.error('error conectando a la base de datos', err);
        process.exit(1);
    }
}

startServer();