import Usuario from '../models/usuario.model.js';
import bcrypt from 'bcrypt';
import {createAccessToken} from '../libs/jwt.js';

export const register = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            correo,
            contrasenia,
            rol,
            foto_perfil,
            fecha_nacimiento,
            estado,
            puntosAcumulados
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

        const nuevoUsuario = new Usuario({
            nombre,
            apellido,
            correo,
            contrasenia: hashedPassword,
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


export const login =async (req, res) => {
    try {
        const {
            correo,
            contrasenia,
        } = req.body;

        if ( !correo || !contrasenia ) {
            return res.status(400).json({ message: "Faltan campos obligatorios." });
        }

        const comparacionCorreo = await Usuario.findOne({ correo });

        if(!comparacionCorreo){
            return res.status(404).json({ message: "Credenciales incorrectas." });
        }

        const comparacionPassword = await bcrypt.compare(contrasenia, comparacionCorreo.contrasenia);

        if(!comparacionPassword){
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const token = await createAccessToken({id: comparacionCorreo.id_usuario});
      
    
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
    res.cookie('token', "",{ 
        expires: new Date(0)
    });
    res.status(200).json({ message: "Sesión cerrada." });
}