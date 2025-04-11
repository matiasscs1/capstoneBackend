import Usuario from '../models/usuario.model.js';
import bcrypt from 'bcrypt';
import { cloudinary } from '../config.js';  // Asegúrate de tener configurado Cloudinary
import { analizarContenidoImagen } from '../services/sightengineService.js';  // Para analizar la imagen




// OBTENER TODOS LOS USUARIOS
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-contrasenia');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios.' });
  }
};

// OBTENER UN USUARIO POR ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    const usuario = await Usuario.findOne({ id_usuario: id_usuario }).select('-contrasenia');

    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' });

    res.json(usuario);
  } catch (error) {
    console.error("Error en obtenerUsuarioPorId:", error);
    res.status(500).json({ message: 'Error al obtener el usuario.' });
  }
};



// ACTUALIZAR UN USUARIO

export const actualizarUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;  // Obtiene el id del usuario desde los parámetros de la URL
    const datos = req.body;
    
    // Verifica si se está enviando una nueva contraseña
    if (datos.contrasenia) {
      const salt = await bcrypt.genSalt(10);
      datos.contrasenia = await bcrypt.hash(datos.contrasenia, salt);
    }

    // Si se envía una foto de perfil, validarla y subirla a Cloudinary
    if (req.files && req.files.foto_perfil) {
      const fotoPerfil = req.files.foto_perfil[0];  // Asumiendo que hay un solo archivo de foto de perfil

      // Verificar el contenido de la imagen
      const { esInapropiada, detalles } = await analizarContenidoImagen(fotoPerfil.path);
      if (esInapropiada) {
        const publicId = fotoPerfil.filename.replace(/\.[^/.]+$/, '');  // Obtener el nombre del archivo
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });  // Eliminar imagen de Cloudinary

        return res.status(400).json({
          error: 'Se detectó contenido inapropiado en la foto de perfil.',
          detalles,
        });
      }

      // Subir la nueva foto de perfil a Cloudinary
      const result = await cloudinary.uploader.upload(fotoPerfil.path, {
        folder: 'usuarios',  // Define una carpeta para las fotos de los usuarios en Cloudinary
        resource_type: 'image',
      });

      // Incluir la nueva URL de la foto de perfil en los datos del usuario
      datos.foto_perfil = [{ url: result.secure_url, tipo: fotoPerfil.mimetype }];
    }

    // Actualizar el usuario con los datos proporcionados
    const actualizado = await Usuario.findOneAndUpdate(
      { id_usuario },
      datos,
      { new: true }
    ).select('-contrasenia');  // Excluir la contraseña de la respuesta

    if (!actualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({ message: 'Usuario actualizado', usuario: actualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el usuario.', error });
  }
};

// ELIMINAR UN USUARIO (puede ser soft delete también)
export const eliminarUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const eliminado = await Usuario.findOneAndDelete({ id_usuario });

    if (!eliminado) return res.status(404).json({ message: 'Usuario no encontrado.' });

    res.json({ message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario.' });
  }
};
