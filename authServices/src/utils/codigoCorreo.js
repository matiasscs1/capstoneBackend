import Verificacion from "../models/verificacion.model.js";
import { sendMail } from "./mailer.js";

export const generarYEnviarCodigo = async (correo, tipo) => {
  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  const expiracion = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

  await Verificacion.findOneAndUpdate(
    { correo, tipo },
    { codigo, expiracion },
    { upsert: true, new: true }
  );

  const asunto = tipo === 'verificacion' ? 'Verifica tu correo' : 'Código de acceso 2FA';

  const mensajeHTML = `
    <h2>Tu código es: ${codigo}</h2>
    <p>Este código expira en 5 minutos.</p>
  `;

  await sendMail(correo, asunto, mensajeHTML);
};
