import Usuario from '../models/usuario.model.js';
import bcrypt from 'bcrypt';
import { createAccessToken } from '../libs/jwt.js';

export const register = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            correo,
            contrasenia,
            rol,
            fecha_nacimiento,
        } = req.body;

        if (!nombre || !apellido || !correo || !contrasenia || !fecha_nacimiento) {
            return res.status(400).json({ message: "Faltan campos obligatorios." });
        }

        const existeUsuario = await Usuario.findOne({ correo });
        if (existeUsuario) {
            return res.status(409).json({ message: "Ya existe un usuario con ese correo." });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasenia, salt);

        const media = req.files && req.files.length > 0
            ? req.files.map(file => ({
                url: file.path,
                tipo: file.mimetype.startsWith('video') ? 'video' : 'imagen'
            }))
            : [];


        const nuevoUsuario = new Usuario({
            nombre,
            apellido,
            correo,
            contrasenia: hashedPassword,
            rol,
            foto_perfil: media,
            fecha_nacimiento
        });

        const userSaved = await nuevoUsuario.save();
        const token = await createAccessToken({
            id: userSaved.id_usuario,
            rol: userSaved.rol
        });
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
                fecha_nacimiento: nuevoUsuario.fecha_nacimiento
            }
        });
    } catch (error) {
        console.error("Error en el registro:", error); // 🔥 Esto muestra el error real
        res.status(500).json({ message: "Error del servidor." });
      }
      
};


export const login = async (req, res) => {
    try {
        const {
            correo,
            contrasenia,
        } = req.body;

        if (!correo || !contrasenia) {
            return res.status(400).json({ message: "Faltan campos obligatorios." });
        }

        const comparacionCorreo = await Usuario.findOne({ correo });

        if (!comparacionCorreo) {
            return res.status(404).json({ message: "Credenciales incorrectas." });
        }

        const comparacionPassword = await bcrypt.compare(contrasenia, comparacionCorreo.contrasenia);

        if (!comparacionPassword) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        if (comparacionCorreo.estado === 'inactivo') {
            return res.status(403).json({ message: 'Tu cuenta está inactiva.' });
        }


        const token = await createAccessToken({
            id: comparacionCorreo.id_usuario,
            rol: comparacionCorreo.rol
        });



        res.cookie('token', token);


        res.json({
            message: "Ingreso exitosamente.",
            usuario: {
                id: comparacionCorreo.id_usuario,
                nombre: comparacionCorreo.nombre,
                apellido: comparacionCorreo.apellido,
                correo: comparacionCorreo.correo,
                rol: comparacionCorreo.rol,
                foto_perfil: comparacionCorreo.foto_perfil,
                fecha_nacimiento: comparacionCorreo.fecha_nacimiento,
                estado: comparacionCorreo.estado,
                puntosAcumulados: comparacionCorreo.puntosAcumulados
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error del servidor." });
    }
};

export const logout = (req, res) => {
    res.cookie('token', "", {
        expires: new Date(0)
    });
    res.status(200).json({ message: "Sesión cerrada." });
}

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
            foto_perfil: userFound.foto_perfil,
            fecha_nacimiento: userFound.fecha_nacimiento,
            estado: userFound.estado,
            puntosAcumulados: userFound.puntosAcumulados
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el perfil." });
    }
};
