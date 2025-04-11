import Perfil from '../models/perfil.model.js';  // Asegúrate de importar el modelo de Perfil
import { analizarContenidoImagen } from '../services/sightengineService.js';  // Para la validación de la imagen
import { cloudinary } from '../config.js';  // Para subir imágenes a Cloudinary

// Crear un nuevo perfil con la foto de portada
export const crearPerfil = async (req, res) => {
    try {
        const { descripcion } = req.body;
        const id_usuario = req.user.id;  // Asumiendo que `id_usuario` está en `req.user` después de la autenticación
        
        // Validación de la foto de portada
        if (req.files && req.files.foto_portada) {
            const fotoPortada = req.files.foto_portada[0]; // Asumiendo que foto_portada es un solo archivo

            // Verificar el contenido de la imagen
            const { esInapropiada, detalles } = await analizarContenidoImagen(fotoPortada.path);
            if (esInapropiada) {
                const publicId = fotoPortada.filename.replace(/\.[^/.]+$/, ''); // Obtener el nombre del archivo
                await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });  // Eliminar imagen de Cloudinary

                return res.status(400).json({
                    error: 'Se detectó contenido inapropiado en la foto de portada.',
                    detalles,
                });
            }

            // Subir la imagen a Cloudinary
            const result = await cloudinary.uploader.upload(fotoPortada.path, {
                folder: 'perfiles', // Define una carpeta para las fotos de perfil en Cloudinary
                resource_type: 'image',
            });

            // Crear el perfil con la foto de portada validada
            const nuevoPerfil = new Perfil({
                id_usuario,
                descripcion,
                foto_portada: result.secure_url, // Guarda la URL de la imagen subida a Cloudinary
            });

            await nuevoPerfil.save();
            res.status(201).json({ message: 'Perfil creado exitosamente', perfil: nuevoPerfil });
        } else {
            return res.status(400).json({ message: 'Foto de portada es requerida.' });
        }
    } catch (error) {
        console.error('Error al crear el perfil:', error);
        res.status(500).json({ message: 'Error al crear el perfil', error });
    }
};

export const getPerfilPorId = async (req, res) => {
    try {
        const id_usuario = req.user.id;  // El id_usuario viene de req.user después de la verificación del token
        const perfil = await Perfil.findOne({ id_usuario });  // Buscamos el perfil por el id_usuario

        if (!perfil) {
            return res.status(404).json({ message: 'Perfil no encontrado.' });
        }

        res.status(200).json({ perfil });
    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        res.status(500).json({ message: 'Error al obtener el perfil', error });
    }
};

export const getTodosPerfiles = async (req, res) => {
    try {
        const perfiles = await Perfil.find();  // Obtiene todos los perfiles

        if (perfiles.length === 0) {
            return res.status(404).json({ message: 'No hay perfiles disponibles.' });
        }

        res.status(200).json({ perfiles });
    } catch (error) {
        console.error('Error al obtener los perfiles:', error);
        res.status(500).json({ message: 'Error al obtener los perfiles', error });
    }
};

export const updatePerfil = async (req, res) => {
    try {
        const { descripcion, foto_portada } = req.body;
        const id_usuario = req.user.id;  // El id_usuario proviene del token en req.user

        const perfil = await Perfil.findOne({ id_usuario });  // Buscar el perfil por id_usuario

        if (!perfil) {
            return res.status(404).json({ message: 'Perfil no encontrado.' });
        }

        // Si se ha subido una nueva foto de portada, realizar validación y subida a Cloudinary
        if (foto_portada) {
            const fotoPortada = req.files.foto_portada[0];  // Asumiendo que hay un solo archivo

            // Verificar el contenido de la imagen
            const { esInapropiada, detalles } = await analizarContenidoImagen(fotoPortada.path);
            if (esInapropiada) {
                const publicId = fotoPortada.filename.replace(/\.[^/.]+$/, '');  // Obtener el nombre del archivo
                await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });  // Eliminar imagen de Cloudinary

                return res.status(400).json({
                    error: 'Se detectó contenido inapropiado en la foto de portada.',
                    detalles,
                });
            }

            // Subir la nueva foto a Cloudinary
            const result = await cloudinary.uploader.upload(fotoPortada.path, {
                folder: 'perfiles',  // Define una carpeta para las fotos de perfil en Cloudinary
                resource_type: 'image',
            });

            // Actualizar la foto de portada en el perfil
            perfil.foto_portada = result.secure_url;  // Guarda la URL de la imagen subida a Cloudinary
        }

        // Actualizar los otros campos
        if (descripcion) perfil.descripcion = descripcion;

        // Guardar los cambios
        await perfil.save();

        res.status(200).json({ message: 'Perfil actualizado exitosamente', perfil });
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ message: 'Error al actualizar el perfil', error });
    }
};

export const deletePerfil = async (req, res) => {
    try {
        const id_usuario = req.user.id;  // El id_usuario proviene del token en req.user

        const perfil = await Perfil.findOne({ id_usuario });  // Buscar el perfil por id_usuario

        if (!perfil) {
            return res.status(404).json({ message: 'Perfil no encontrado.' });
        }

        // Eliminar el perfil de la base de datos
        await perfil.remove();

        res.status(200).json({ message: 'Perfil eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el perfil:', error);
        res.status(500).json({ message: 'Error al eliminar el perfil', error });
    }
};
