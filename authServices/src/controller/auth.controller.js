import Usuario from '../models/usuario.model.js';
import bcrypt from 'bcrypt';
import { generarYEnviarCodigo } from '../utils/codigoCorreo.js';

// Almacenamiento temporal 
export const registrosTemporales = new Map();

// 1. Registro temporal: guarda usuario en memoria y envía código
export const registerTemp = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasenia, fecha_nacimiento } = req.body;

    const existeUsuario = await Usuario.findOne({ correo });
    if (existeUsuario) {
      return res.status(409).json({ message: "Ya existe un usuario con ese correo." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasenia, salt);

    const media = req.files && req.files.length > 0
      ? req.files.map(file => ({
          url: file.path,
          tipo: file.mimetype.startsWith('video') ? 'video' : 'imagen'
        }))
      : [];

    registrosTemporales.set(correo, {
      nombre,
      apellido,
      correo,
      contrasenia: hashedPassword,
      fecha_nacimiento,
      foto_perfil: media
    });

    await generarYEnviarCodigo(correo, 'verificacion');

    res.json({ message: "Código enviado al correo. Verifica para completar el registro." });
  } catch (error) {
    console.error("Error en registerTemp:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

// 2. Login normal (envía código 2FA si credenciales son válidas)
export const login = async (req, res) => {
  try {
    const { correo, contrasenia } = req.body;

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ message: "Credenciales incorrectas." });
    }

    const passwordValido = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!passwordValido) {
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    if (usuario.estado === 'inactivo') {
      return res.status(403).json({ message: 'Tu cuenta está inactiva.' });
    }

    await generarYEnviarCodigo(correo, '2fa');

    res.json({ message: "Código 2FA enviado al correo." });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

// Logout
export const logout = (req, res) => {
  res.cookie('token', "", {
    expires: new Date(0)
  });
  res.status(200).json({ message: "Sesión cerrada." });
};

export const profile = async (req, res) => {
  try {
    const userFound = await Usuario.findOne({ id_usuario: req.user.id });
    

    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.json({
      id: userFound.id_usuario,
      nombre: userFound.nombre,
      apellido: userFound.apellido,
      correo: userFound.correo,
      rol: userFound.rol,
      foto_perfil: userFound.foto_perfil?.[0]?.url || null,
      fecha_nacimiento: userFound.fecha_nacimiento,
      estado: userFound.estado,
      puntosAcumulados: userFound.puntosAcumulados
    });
  } catch (error) {
    console.error("Error en profile:", error);
    res.status(500).json({ message: "Error al obtener el perfil." });
  }
};

export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    console.log("Buscando por id_usuario:", id_usuario);

    const usuario = await Usuario.findOne({ id_usuario: id_usuario }).select('-contrasenia');

    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' });

    res.json(usuario);
  } catch (error) {
    console.error("Error en obtenerUsuarioPorId:", error);
    res.status(500).json({ message: 'Error al obtener el usuario.' });
  }
};


