import Comentario from '../models/comentario.model.js';
import { obtenerDatosUsuario } from '../services/authServices.services.js';
import { contienePalabrasOfensivas } from '../services/textModeration.js';

export const crearComentario = async (req, res) => {
  try {
    const { publicacionId, texto } = req.body;

    if (!texto?.trim()) {
      return res.status(400).json({ message: 'El comentario no puede estar vacío' });
    }

    const esOfensivo = contienePalabrasOfensivas(texto);

    if (esOfensivo) {
      return res.status(400).json({
        error: 'Tu comentario contiene lenguaje inapropiado. Por favor, modifícalo.'
      });
    }

    const nuevoComentario = new Comentario({
      publicacionId,
      autorId: req.user.id,
      texto: texto.trim()
    });

    const guardado = await nuevoComentario.save();
    res.status(201).json(guardado);
  } catch (err) {
    console.error('Error al crear comentario:', err);
    res.status(500).json({ error: 'Error al crear comentario' });
  }
};

// LISTAR COMENTARIOS CON DATOS DEL AUTOR
export const listarComentarios = async (req, res) => {
  const { publicacionId } = req.params;
  try {
    const comentarios = await Comentario.find({ publicacionId }).sort({ fecha: -1 });

    const enriquecidos = await Promise.all(
      comentarios.map(async (comentario) => {
        const token = req.token;

        const autor = await obtenerDatosUsuario(comentario.autorId, token)

        return {
          ...comentario.toObject(),
          autor: autor
            ? {
                nombre: autor.nombre,
                fotoPerfil: autor.fotoPerfil,
                rol: autor.rol
              }
            : null
        };
      })
    );

    res.json(enriquecidos);
  } catch (err) {
    res.status(500).json({ error: 'Error al listar comentarios' });
  }
};

// EDITAR COMENTARIO
export const editarComentario = async (req, res) => {
  const { id_comentario } = req.params;
  const { texto } = req.body;
  try {
    const comentario = await Comentario.findOne({ id_comentario });

    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (comentario.autorId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para editar este comentario' });
    }

    if (!texto?.trim()) {
      return res.status(400).json({ message: 'El comentario no puede estar vacío' });
    }

    comentario.texto = texto.trim();
    await comentario.save();

    res.json(comentario);
  } catch (err) {
    res.status(500).json({ error: 'Error al editar comentario' });
  }
};

// ELIMINAR COMENTARIO
export const eliminarComentario = async (req, res) => {
  const { id_comentario } = req.params;
  try {
    const comentario = await Comentario.findOne({ id_comentario });

    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (comentario.autorId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' });
    }

    await comentario.deleteOne();
    res.json({ message: 'Comentario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar comentario' });
  }
};
