import Usuario from '../models/usuario.model.js';
import bcrypt from 'bcrypt';
import {createAccessToken} from '../libs/jwt.js';

// Registro de usuario
export const register = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            correo,
            contraseña,
            rol,
            foto_perfil,
            fecha_nacimiento,
            estado,
            puntosAcumulados
        } = req.body;

        if (!nombre || !apellido || !correo || !contraseña || !fecha_nacimiento) {
            return res.status(400).json({ message: "Faltan campos obligatorios." });
        }

        const existeUsuario = await Usuario.findOne({ correo });
        if (existeUsuario) {
            return res.status(409).json({ message: "Ya existe un usuario con ese correo." });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        const nuevoUsuario = new Usuario({
            nombre,
            apellido,
            correo,
            contraseña: hashedPassword,
            rol,
            foto_perfil,
            fecha_nacimiento,
            estado,
            puntosAcumulados
        });

       const userSaved =  await nuevoUsuario.save();
       const token = await createAccessToken({id: userSaved.id_usuario});

        res.cookie('token', token);
       

        res.json({
            message: "Usuario registrado exitosamente.",
            usuario: {
                id: nuevoUsuario.id_usuario,
                nombre: nuevoUsuario.nombre,
                apellido: nuevoUsuario.apellido,
                correo: nuevoUsuario.correo,
                rol: nuevoUsuario.rol,
                foto_perfil: nuevoUsuario.foto_perfil,
                fecha_nacimiento: nuevoUsuario.fecha_nacimiento,
                estado: nuevoUsuario.estado,
                puntosAcumulados: nuevoUsuario.puntosAcumulados
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error del servidor." });
    }
};

export const login = (req, res) => res.send("login");
