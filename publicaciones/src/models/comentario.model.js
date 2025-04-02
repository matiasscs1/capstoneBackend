// publicaciones/models/comentario.model.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const comentarioSchema = new mongoose.Schema({
  id_comentario: {
    type: String,
    default: uuidv4,
    unique: true
  },
  publicacionId: {
    type: String,
    required: true
  },
  autorId: {
    type: String,
    required: true
  },
  texto: {
    type: String,
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Comentario', comentarioSchema);
