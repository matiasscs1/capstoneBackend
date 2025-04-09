/*Table Insignias {
    id_insignia varchar [pk]
    nombre varchar
    descripcion varchar
    imagenUrl varchar
    activa boolean
  }*/

import mongoose from "mongoose";

import { v4 as uuidv4 } from 'uuid';

const insigniaSchema = new mongoose.Schema({
    id_insignia: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    imagenes: [
        {
            url: String,
            tipo: { type: String, enum: ['imagen'] }
        }
    ],
    puntosrequeridos: {
        type: Number,
        required: true,
        default: 0
    },
    activa: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Insignia', insigniaSchema);
  