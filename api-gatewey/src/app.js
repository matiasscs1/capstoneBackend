import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import  apiGatewayRoutes from './routes/apiGatawey.routes.js';
dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiGatewayRoutes)




export default app;