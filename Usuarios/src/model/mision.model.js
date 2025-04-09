import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const misionSchema = new mongoose.Schema({
    id_mision: {
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
    puntos: {
        type: Number,
        required: true
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Mision', misionSchema);
