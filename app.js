// Importación de módulos necesarios
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Rutas de facturas
const facturasRoutes = require('./routes/facturas');

// Configuración de variables de entorno desde el archivo .env
dotenv.config();

// Inicialización de la aplicación Express
const app = express();

// Middleware para parsear solicitudes en formato JSON
app.use(express.json());

// Middleware para habilitar CORS (permite solicitudes desde otros dominios)
app.use(cors());

// Puerto de la aplicación (desde variable de entorno o 3000 por defecto)
const port = process.env.PORT || 3000;

// Ruta raíz de prueba para verificar que el servidor está corriendo
app.get('/', (req, res) => {
    res.send('Servidor corriendo correctamente');
});

// Conexión a la base de datos PostgreSQL
const db = require('./models/db');

// Verificación de conexión a la base de datos
db.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error conectando a PostgreSQL:', err);
    } else {
        console.log('Conectado a PostgreSQL. Hora actual:', res.rows[0].now);
    }
});

// Middleware para manejar las rutas relacionadas a facturas
app.use('/api/facturas', facturasRoutes);

// Inicio del servidor y escucha en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});