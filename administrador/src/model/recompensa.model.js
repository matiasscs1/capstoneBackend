/*Table Recompensas {
  id_recompensa varchar [pk]
  nombre varchar
  descripcion varchar
  puntosRequeridos int
  imagenUrl varchar
  cantidadDisponible int
  activa boolean
}*/

import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const recompensaSchema = new mongoose.Schema({
    id_recompensa: {
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
    puntosRequeridos: {
        type: Number,
        required: true
    },
    cantidadDisponible: {
        type: Number,
        default: 0
    },
    activa: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Recompensa', recompensaSchema);