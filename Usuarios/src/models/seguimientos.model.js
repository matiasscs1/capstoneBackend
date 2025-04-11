import mongoose from 'mongoose';

const seguimientoSchema = new mongoose.Schema({
  id_seguimiento: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),  // Genera un ID único para cada seguimiento
    trim: true,
  },
  seguidorId: {
    type: String,
    required: true,
    ref: 'Usuario',  // Referencia al modelo de Usuario
  },
  seguidoId: {
    type: String,
    required: true,
    ref: 'Usuario',  // Referencia al modelo de Usuario
  },
  fecha: {
    type: Date,
    default: Date.now,  // Fecha y hora actual al momento de crear el seguimiento
  },
});

// Crear el modelo de Seguimiento
const Seguimiento = mongoose.model('Seguimiento', seguimientoSchema);

export default Seguimiento;
