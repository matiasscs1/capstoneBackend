import Usuario from '../models/usuario.model.js';
import bcrypt from 'bcrypt';

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
    const usuario = await Usuario.findOne({ id_usuario }).select('-contrasenia');

    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario.' });
  }
};



// ACTUALIZAR UN USUARIO
export const actualizarUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const datos = req.body;

    if (datos.contrasenia) {
      const salt = await bcrypt.genSalt(10);
      datos.contrasenia = await bcrypt.hash(datos.contrasenia, salt);
    }

    const actualizado = await Usuario.findOneAndUpdate(
      { id_usuario },
      datos,
      { new: true }
    ).select('-contrasenia');

    if (!actualizado) return res.status(404).json({ message: 'Usuario no encontrado.' });

    res.json({ message: 'Usuario actualizado', usuario: actualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario.' });
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
