import express from 'express';
import morgan from 'morgan';
import administradorRoutes from './routes/administrador.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser()); 
app.use(administradorRoutes);


app.use(express.urlencoded({ extended: true })); 

export default app;
