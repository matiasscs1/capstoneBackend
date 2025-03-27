import mongoose from "mongoose";
 
/*Table Usuarios {
    id_usuario varchar [pk]
    nombre varchar
    apellido varchar
    correo varchar
    contraseña varchar
    rol varchar
    foto_perfil varchar
    fecha_nacimiento date
    estado varchar
    puntosAcumulados int
  }
*/    
const usuarioSchema = new mongoose.Schema({
    id_usuario: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    contraseña: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['administrador', 'usuario', 'profesor', 'representante'],
    },
    foto_perfil: {
        type: String,
        default: ''
    },
    fecha_nacimiento: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        enum: ['activo', 'inactivo'],
        default: 'activo'
    },
    puntosAcumulados:{
      type:Number,
      default : 0
  }
});