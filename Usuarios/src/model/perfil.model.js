import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";


export const perfilSchema = new mongoose.Schema({
    id_perfil: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4,
        trim: true
    },
    id_usuario: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    imagenes: [
        {
            url: String,
            tipo: { type: String, enum: ['imagen', 'video'] }
        }
    ],
});

export default mongoose.model("Perfil", perfilSchema);