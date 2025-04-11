/*
Table Actividad {
  id_actividad varchar [pk]
  titulo varchar
  descripcion vaechar
  puntosOtorgados int
  fechaInicio date
  fechaFin date
  estado varchar
}
*/

import mongoose from "mongoose";

import {v4 as uuidv4} from 'uuid';

const actividadSchema = new mongoose.Schema({
    id_actividad: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4,
        trim: true
    },
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    activa: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Actividad', actividadSchema);