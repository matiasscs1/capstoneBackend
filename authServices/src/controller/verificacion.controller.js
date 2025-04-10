import Verificacion from "../models/verificacion.model.js";
import Usuario from "../models/usuario.model.js";
import { createAccessToken } from "../libs/jwt.js";
import { registrosTemporales } from "./auth.controller.js"; 

export const verificarCorreo = async (req, res) => {
  const { correo, codigo } = req.body;

  const verif = await Verificacion.findOne({ correo, tipo: 'verificacion' });

  if (!verif || verif.codigo !== codigo || verif.expiracion < new Date()) {
    return res.status(400).json({ message: "Código inválido o expirado." });
  }

  const datos = registrosTemporales.get(correo);
  if (!datos) {
    return res.status(404).json({ message: "Datos temporales no encontrados." });
  }

  const nuevoUsuario = new Usuario(datos);
  const userSaved = await nuevoUsuario.save();

  registrosTemporales.delete(correo); // Limpieza
  await Verificacion.deleteOne({ _id: verif._id });

  const token = await createAccessToken({
    id: userSaved.id_usuario,
    rol: userSaved.rol
  });

  res.cookie('token', token);
  res.json({
    message: "Usuario registrado exitosamente.",
    usuario: {
      id: userSaved.id_usuario,
      nombre: userSaved.nombre,
      apellido: userSaved.apellido,
      correo: userSaved.correo,
      rol: userSaved.rol,
      foto_perfil: userSaved.foto_perfil,
      fecha_nacimiento: userSaved.fecha_nacimiento,
      estado: userSaved.estado,
      puntosAcumulados: userSaved.puntosAcumulados
    }
  });
};
// En el controlador verificar2FA
export const verificar2FA = async (req, res) => {
  const { correo, codigo } = req.body;

  const verif = await Verificacion.findOne({ correo, tipo: '2fa' });

  if (!verif || verif.codigo !== codigo || verif.expiracion < new Date()) {
    return res.status(400).json({ message: "Código inválido o expirado." });
  }

  const user = await Usuario.findOne({ correo });
  if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

  await Verificacion.deleteOne({ _id: verif._id });

  const token = await createAccessToken({
    id: user.id_usuario,
    rol: user.rol
  });

  res.cookie('token', token, {
    httpOnly: true, // Hace que la cookie no sea accesible desde JavaScript
    secure: process.env.NODE_ENV === 'production', // Solo si es en producción, usa HTTPS
    maxAge: 3600000, // Duración de la cookie (1 hora en este ejemplo)
    sameSite: 'None', // Para permitir cookies entre diferentes orígenes (CORS)
  });
  
  res.json({
    message: "2FA verificado correctamente. Sesión iniciada.",
    usuario: {
      id: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      rol: user.rol,
      foto_perfil: user.foto_perfil,
      fecha_nacimiento: user.fecha_nacimiento,
      token : token,
      estado: user.estado,
      puntosAcumulados: user.puntosAcumulados
    }
  });
};

