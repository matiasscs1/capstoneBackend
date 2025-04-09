

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


const evidenciaSchema = new mongoose.Schema({
    id_evidencia: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4,
        trim: true
    },
    id_inscripcion: {
        type: String,
        required: true,
    },
    imagenes: [
        {
            url: String,
            tipo: { type: String, enum: ['imagen','video'] }
        }
    ],
    descripcion: {
        type: String,
        required: true
    },
    tipo: {
        type: Boolean,
        required: true,
        default: false
    },
    fechaSubida: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Evidencia', evidenciaSchema);