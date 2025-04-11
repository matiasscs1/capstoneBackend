import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiGatewayRoutes from './routes/apiGatawey.routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// Configura CORS para permitir solicitudes solo desde http://localhost:5173
app.use(cors({
    origin: 'http://localhost:5173',  // Especifica el origen de tu frontend
    credentials: true,  // Permite el envío de cookies/credenciales
}));

// Middleware para procesar JSON y datos urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas del API Gateway
app.use(apiGatewayRoutes);

export default app;
