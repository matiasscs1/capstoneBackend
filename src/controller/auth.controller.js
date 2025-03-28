import Usuario from '../models/usuario.model.js';
import bcrypt from 'bcrypt';

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

        await nuevoUsuario.save();
        console.log(nuevoUsuario);

        res.status(201).json({
            message: "Usuario registrado exitosamente.",
            usuario: nuevoUsuario
        });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error del servidor." });
    }
};

export const login = (req, res) => res.send("login");
