import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js'; 
import cookieParser from 'cookie-parser';
import cors from 'cors'; 

const app = express();

// Configura CORS para permitir solicitudes desde http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173',  // Especifica el origen de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
  credentials: true,  // Permite el envío de cookies/credenciales
}));

// Otros middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Rutas de autenticación
app.use(authRoutes);

export default app;
