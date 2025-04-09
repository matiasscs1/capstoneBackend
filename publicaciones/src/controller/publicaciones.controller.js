import Publicacion from '../models/publicacion.model.js';
import { obtenerDatosUsuario } from '../services/authServices.services.js';
import { analizarContenidoImagen, analizarFrameDeVideo } from '../services/sightengineService.js';
import { cloudinary } from '../config/config.js';

// CREAR PUBLICACIÓN


export const crearPublicacion = async (req, res) => {
  try {
    const { descripcion } = req.body;
    const media = [];

    for (const file of req.files) {
      const tipo = file.mimetype.startsWith('video') ? 'video' : 'imagen';
      const url = file.path;

      //

     `
  `

      // IMAGEN
      if (tipo === 'imagen') {
        const { esInapropiada, detalles } = await analizarContenidoImagen(url);
        if (esInapropiada) {
          const publicId = file.filename.replace(/\.[^/.]+$/, '');
          await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });

          return res.status(400).json({
            error: 'Se detectó contenido inapropiado en la imagen.',
            detalles
          });
        }
      }

      // VIDEO
      if (tipo === 'video') {
        const { esInapropiada, detalles } = await analizarFrameDeVideo(url);
        if (esInapropiada) {
          const publicId = file.filename.replace(/\.[^/.]+$/, '');
          await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });

          return res.status(400).json({
            error: 'Se detectó contenido inapropiado en el video.',
            detalles
          });
        }
      }

      media.push({ url, tipo });
    }



    const nueva = new Publicacion({
      autorId: req.user.id,
      descripcion,
      imagenes: media,
    });

    const guardada = await nueva.save();
    res.status(201).json(guardada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear publicación' });
  }
};


// DAR LIKE
export const darLike = async (req, res) => {
  const { id_publicacion } = req.params;
  try {
    const pub = await Publicacion.findOne({ id_publicacion });

    if (!pub) return res.status(404).json({ message: 'Publicación no encontrada' });

    const yaDioLike = pub.likes.includes(req.user.id);

    if (yaDioLike) {
      // Quitar el like
      pub.likes = pub.likes.filter(id => id !== req.user.id);
    } else {
      // Agregar el like
      pub.likes.push(req.user.id);
    }

    await pub.save();

    res.json({
      message: yaDioLike ? 'Like eliminado' : 'Like agregado',
      cantidadLikes: pub.likes.length,
      meGusta: !yaDioLike,
      publicacion: pub
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al procesar el like' });
  }
};


// FEED GENERAL
export const listarPublicaciones = async (req, res) => {
  try {
    const rol = req.user.rol;
    const miId = req.user.id;
    const token = rol.token;

    const publicaciones = await Publicacion.find({}).sort({ fechaPublicacion: -1 });

    const enriquecidas = await Promise.all(
      publicaciones.map(async (pub) => {
        const cantidadLikes = pub.likes.length;
        const meGusta = pub.likes.includes(miId);

        let datosAutor = null;

        if (rol === 'estudiante' || rol === 'profesor') {

          const autor = await obtenerDatosUsuario(pub.autorId, token)
          if (autor) {
            datosAutor = {
              nombre: autor.nombre,
              fotoPerfil: autor.fotoPerfil,
              rol: autor.rol
            };
          }
        }

        return {
          ...pub.toObject(),
          cantidadLikes,
          meGusta,
          autor: datosAutor
        };
      })
    );

    res.json(enriquecidas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar publicaciones' });
  }
};

// MIS PUBLICACIONES
export const misPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find({ autorId: req.user.id }).sort({ fechaPublicacion: -1 });

    const token = req.token;
    const autor = await obtenerDatosUsuario(req.user.id, token);

    const enriquecidas = publicaciones.map((pub) => ({
      ...pub.toObject(),
      cantidadLikes: pub.likes.length,
      meGusta: pub.likes.includes(req.user.id),
      autor: autor
        ? {
          nombre: autor.nombre,
          fotoPerfil: autor.fotoPerfil,
          rol: autor.rol
        }
        : null
    }));

    res.json(enriquecidas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener tus publicaciones' });
  }
};

// PUBLICACIONES DE UN USUARIO (PERFIL PÚBLICO)
export const publicacionesPorUsuario = async (req, res) => {
  const { autorId } = req.params;
  const rol = req.user.rol;

  try {
    if (!['estudiante', 'profesor'].includes(rol)) {
      return res.status(403).json({ message: 'No tienes permiso para ver perfiles.' });
    }

    const publicaciones = await Publicacion.find({ autorId }).sort({ fechaPublicacion: -1 });
    const token = req.token;
    const autor = await obtenerDatosUsuario(req.user.id, token);

    const enriquecidas = publicaciones.map((pub) => ({
      ...pub.toObject(),
      cantidadLikes: pub.likes.length,
      meGusta: pub.likes.includes(req.user.id),
      autor: autor
        ? {
          nombre: autor.nombre,
          fotoPerfil: autor.fotoPerfil,
          rol: autor.rol
        }
        : null
    }));

    res.json(enriquecidas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener publicaciones del usuario' });
  }
};

// ELIMINAR PUBLICACIÓN
export const eliminarPublicacion = async (req, res) => {
  const { id_publicacion } = req.params;
  try {
    const publicacion = await Publicacion.findOne({ id_publicacion });

    if (!publicacion) return res.status(404).json({ message: 'Publicación no encontrada' });
    if (publicacion.autorId !== req.user.id) return res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación' });

    await publicacion.deleteOne();
    res.json({ message: 'Publicación eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar publicación' });
  }
};

export const actualizarDescripcion = async (req, res) => {
  const { id_publicacion } = req.params;
  const { descripcion } = req.body;

  try {
    const publicacion = await Publicacion.findOne({ id_publicacion });

    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    if (publicacion.autorId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta publicación' });
    }

    publicacion.descripcion = descripcion?.trim() || '';
    await publicacion.save();

    res.json({ message: 'Descripción actualizada correctamente', publicacion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar la publicación' });
  }
};