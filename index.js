require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(express.json()); // Para parsear JSON en las peticiones
app.use(cors()); // Permitir conexiones externas
app.use(morgan('dev')); // Mostrar logs de las peticiones en la terminal

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando correctamente! 🚀');
});

// Definir puerto y escuchar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
