import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import publicacionesRoutes from './routes/publicacion.routes.js';
import cors from 'cors'; 


dotenv.config();

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(publicacionesRoutes);

// Middleware de errores (Multer y general)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  console.error('Error no controlado:', err);
  res.status(500).json({ message: 'Error interno del servidor.' });
});
app.use(cors({
  origin: 'http://localhost:5173',  // Especifica el origen de tu frontend
  credentials: true,  // Permite el envío de cookies/credenciales
}));


export default app;
