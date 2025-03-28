import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
 
const usuarioSchema = new mongoose.Schema({
    id_usuario: {
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
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    correo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    contrasenia: {
        type: String,
        required: true,
        trim: true
    },
    rol: {
        type: String,
        enum: ['administrador', 'usuario', 'profesor', 'representante'],
        trim: true
    },
    foto_perfil: {
        type: String,
        default: '',
        trim: true
    },
    fecha_nacimiento: {
        type: Date,
        required: true,
        trim: true
    },
    estado: {
        type: String,
        enum: ['activo', 'inactivo'],
        default: 'activo',
        trim: true
    },
    puntosAcumulados:{
      type:Number,
      default : 0
  }
});
export default mongoose.model('Usuario', usuarioSchema);
