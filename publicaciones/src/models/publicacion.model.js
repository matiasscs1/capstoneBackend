// publicaciones/models/publicacion.model.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const publicacionSchema = new mongoose.Schema({
  id_publicacion: {
    type: String,
    default: uuidv4,
    unique: true
  },
  autorId: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  imagenes: [
    {
      url: String,
      tipo: { type: String, enum: ['imagen', 'video'] }
    }
  ],
  likes: [String], // arreglo de id_usuario
  fechaPublicacion: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Publicacion', publicacionSchema);
