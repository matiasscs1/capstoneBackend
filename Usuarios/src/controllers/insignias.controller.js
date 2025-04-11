import Insignia from '../models/insignias.model.js';
import { analizarContenidoImagen } from '../services/sightengineService.js';
import { cloudinary } from '../config.js';

export const crearInsignia = async (req, res) => {
    try {
        const { nombre, descripcion, puntosrequeridos } = req.body;
        const media = [];
        for (const file of req.files) {
            const tipo = file.mimetype.startsWith('video') ? 'video' : 'imagen';
            const url = file.path;

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
            media.push({ url, tipo });

        }
        const insignia = new Insignia({
            nombre,
            descripcion,
            imagen: media,
            puntosrequeridos
        });
        await insignia.save();
        return res.status(201).json({ message: 'Insignia creada correctamente' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error al crear insignia' });
    }
}

export const obtenerInsignias = async (req, res) => {
    try {
        const insignias = await Insignia.find();
        return res.status(200).json(insignias);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error al obtener insignias' });
    }
}

export const obtenerInsigniaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const insignia = await Insignia.findById(id);
        if (!insignia) {
            return res.status(404).json({ message: 'Insignia no encontrada' });
        }
        return res.status(200).json(insignia);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error al obtener insignia' });
    }
}

export const actualizarInsignia = async (req, res) => {
    try {
      const { id } = req.params;  // ID de la insignia a actualizar
      const { nombre, descripcion, puntosrequeridos } = req.body;  // Nuevo nombre y descripción de la insignia
  
      // Buscar la insignia por ID
      const insignia = await Insignia.findById(id);
      if (!insignia) {
        return res.status(404).json({ message: 'Insignia no encontrada' });
      }
  
      // Actualizamos los campos de nombre y descripción
      insignia.nombre = nombre || insignia.nombre;
      insignia.descripcion = descripcion || insignia.descripcion;
    insignia.puntosrequeridos = puntosrequeridos || insignia.puntosrequeridos;
  
      // Eliminar todas las imágenes anteriores de Cloudinary y de la base de datos
      if (insignia.imagenes && insignia.imagenes.length > 0) {
        for (const imagen of insignia.imagenes) {
          const publicId = imagen.url.replace(/\.[^/.]+$/, '');  // Eliminar la extensión de la URL
          await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });  // Eliminar de Cloudinary
        }
      }
  
      // Vaciar el array de imágenes antes de agregar la nueva
      insignia.imagenes = [];
  
      // Si hay nuevos archivos (imágenes o videos), los agregamos
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const tipo = file.mimetype.startsWith('video') ? 'video' : 'imagen';
          const url = file.path;
  
          // Validación de contenido inapropiado en la imagen
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
  
          // Agregar la nueva imagen al array de imágenes
          insignia.imagenes.push({ url, tipo });
        }
      }
  
      // Guardar los cambios en la base de datos
      await insignia.save();
  
      return res.status(200).json({ message: 'Insignia actualizada correctamente', insignia });
    } catch (error) {
      console.error('Error en actualizarInsignia:', error);
      return res.status(500).json({ message: 'Error al actualizar insignia' });
    }
};

export const eliminarInsignia = async (req, res) => {
    try {
        const { id } = req.params; // ID de la insignia a eliminar

        // Buscar la insignia por ID
        const insignia = await Insignia.findById(id);
        if (!insignia) {
            return res.status(404).json({ message: 'Insignia no encontrada' });
        }

        // Eliminar todas las imágenes de Cloudinary y de la base de datos
        if (insignia.imagenes && insignia.imagenes.length > 0) {
            for (const imagen of insignia.imagenes) {
                const publicId = imagen.url.replace(/\.[^/.]+$/, ''); // Eliminar la extensión de la URL
                await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }); // Eliminar de Cloudinary
            }
        }

        // Eliminar la insignia de la base de datos
        await Insignia.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Insignia eliminada correctamente' });
    } catch (error) {
        console.error('Error en eliminarInsignia:', error);
        return res.status(500).json({ message: 'Error al eliminar insignia' });
    }
}
