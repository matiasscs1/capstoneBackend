import mongoose from "mongoose";

const verificacionSchema = new mongoose.Schema({
  correo: { type: String, required: true },
  codigo: { type: String, required: true },
  tipo: { type: String, enum: ['verificacion', '2fa'], required: true },
  expiracion: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model("Verificacion", verificacionSchema);
