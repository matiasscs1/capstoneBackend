import Perfil from '../models/perfil.model.js';  // Asegúrate de importar el modelo de Perfil
import { analizarContenidoImagen } from '../services/sightengineService.js';  // Para la validación de la imagen
import { cloudinary } from '../config.js';  // Para subir imágenes a Cloudinary

// Crear un nuevo perfil con la foto de portada
export const crearPerfil = async (req, res) => {
    try {
        const { descripcion } = req.body;
        const id_usuario = req.user.id;  // Se obtiene el id_usuario del token (supongo que se maneja con JWT)
        const media = [];

        // Verificar si el usuario ya tiene un perfil existente
        const perfilExistente = await Perfil.findOne({ id_usuario });

        if (perfilExistente) {
            return res.status(400).json({ message: 'Este usuario ya tiene un perfil.' });
        }

        // Procesar los archivos (si existen) y verificar si son inapropiados
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const tipo = file.mimetype.startsWith('video') ? 'video' : 'imagen';
                const url = file.path;

                // Si es una imagen, validarla para contenido inapropiado
                if (tipo === 'imagen') {
                    const { esInapropiada, detalles } = await analizarContenidoImagen(url);
                    if (esInapropiada) {
                        const publicId = file.filename.replace(/\.[^/.]+$/, '');  // Obtener el nombre del archivo
                        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });  // Eliminar la imagen de Cloudinary

                        return res.status(400).json({
                            error: 'Se detectó contenido inapropiado en la imagen.',
                            detalles
                        });
                    }
                }

                media.push({ url, tipo });
            }
        }

        // Crear el perfil nuevo
        const nuevoPerfil = new Perfil({
            id_usuario,
            descripcion,
            imagenes: media,
        });

        // Guardar el perfil en la base de datos
        const guardada = await nuevoPerfil.save();

        // Responder con éxito
        res.status(201).json({ message: 'Perfil creado exitosamente', perfil: guardada });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear el perfil' });
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
      const { descripcion } = req.body;  // Descripción que se actualizará
      const id_usuario = req.user.id;  // El id del usuario proviene del token (authRequired)
      const media = [];
  
      // Buscar el perfil por id_usuario
      const perfil = await Perfil.findOne({ id_usuario });
  
      if (!perfil) {
        return res.status(404).json({ message: 'Perfil no encontrado.' });
      }
  
      // Verificar que el usuario es el propietario del perfil o tiene rol de administrador
      // Si el id del perfil no coincide con el id del usuario actual y el rol no es 'administrador', se bloquea la actualización
      if (perfil.id_usuario !== id_usuario && req.user.rol !== 'administrador') {
        return res.status(403).json({ message: 'No tienes permisos para actualizar este perfil.' });
      }
  
      // Si se subieron nuevos archivos, procesar los archivos de tipo imagen o video
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const tipo = file.mimetype.startsWith('video') ? 'video' : 'imagen';
          const url = file.path;
  
          // Verificación y procesamiento de imágenes
          if (tipo === 'imagen') {
            const { esInapropiada, detalles } = await analizarContenidoImagen(url);
            if (esInapropiada) {
              const publicId = file.filename.replace(/\.[^/.]+$/, '');  // Obtener el nombre del archivo
              await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });  // Eliminar imagen de Cloudinary
  
              return res.status(400).json({
                error: 'Se detectó contenido inapropiado en la imagen.',
                detalles,
              });
            }
          }
  
          // Guardar la URL de la imagen o video procesado
          media.push({ url, tipo });
        }
      }
  
      // Si se ha enviado una nueva foto de portada, manejarla
      if (req.files && req.files.foto_portada) {
        const fotoPortada = req.files.foto_portada[0];  // Tomar la primera imagen (si es que existe)
        
        // Subir la foto de portada a Cloudinary
        const result = await cloudinary.uploader.upload(fotoPortada.path, {
          folder: 'perfiles',  // Define una carpeta para las fotos de perfil en Cloudinary
          resource_type: 'image',
        });
  
        // Actualizar la URL de la foto de portada
        perfil.foto_portada = result.secure_url;
      }
  
      // Actualizar la descripción del perfil (si se envió)
      if (descripcion) perfil.descripcion = descripcion;
  
      // Si hay nuevos medios (fotos o videos), agregarlos al perfil
      if (media.length > 0) perfil.imagenes = media;
  
      // Guardar los cambios en el perfil
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
