import Seguimiento from '../models/seguimiento.model.js';  // Importamos el modelo de Seguimiento
import Usuario from '../models/usuario.model.js';  // Para obtener los detalles de los usuarios (seguido y seguidor)

// Crear un nuevo seguimiento (seguidor sigue a seguido)
export const crearSeguimiento = async (req, res) => {
  try {
    const { seguidoId } = req.body;  // Obtenemos el ID del usuario que será seguido

    const seguidorId = req.user.id;  // El id del seguidor lo obtenemos del token (req.user.id)

    // Verificar si el seguidor ya sigue al seguido
    const seguimientoExistente = await Seguimiento.findOne({ seguidorId, seguidoId });
    if (seguimientoExistente) {
      return res.status(400).json({ message: 'El usuario ya sigue a este usuario.' });
    }

    // Crear un nuevo seguimiento
    const nuevoSeguimiento = new Seguimiento({
      seguidorId,
      seguidoId,
      fecha: new Date(),  // Fecha actual
    });

    // Guardar el seguimiento en la base de datos
    await nuevoSeguimiento.save();

    res.status(201).json({ message: 'Seguimiento creado exitosamente', seguimiento: nuevoSeguimiento });
  } catch (error) {
    console.error('Error al crear seguimiento:', error);
    res.status(500).json({ message: 'Error al crear seguimiento', error });
  }
};

// Contar los seguidores y seguidos de un usuario
export const contarSeguidoresYSeguidos = async (req, res) => {
  try {
    const id_usuario = req.user.id;  // Obtenemos el ID del usuario desde req.user

    // Contar los seguidores (quiénes siguen a este usuario)
    const seguidoresCount = await Seguimiento.countDocuments({ seguidoId: id_usuario });

    // Contar los seguidos (a quién sigue este usuario)
    const seguidosCount = await Seguimiento.countDocuments({ seguidorId: id_usuario });

    res.status(200).json({
      seguidoresCount,
      seguidosCount,
    });
  } catch (error) {
    console.error('Error al contar seguidores y seguidos:', error);
    res.status(500).json({ message: 'Error al contar seguidores y seguidos', error });
  }
};

// Obtener los detalles del seguidor y seguido
export const obtenerSeguidorYSeguido = async (req, res) => {
  try {
    const id_usuario = req.user.id;  // Obtenemos el ID del usuario desde req.user

    // Obtener los seguimientos donde este usuario es seguidor o seguido
    const seguimientos = await Seguimiento.find({
      $or: [{ seguidorId: id_usuario }, { seguidoId: id_usuario }],
    }).populate('seguidorId seguidoId', 'nombre apellido correo');  // Poblamos los datos del seguidor y seguido

    // Obtener los detalles del seguidor y seguido
    const seguimientosConDetalles = await Promise.all(seguimientos.map(async (seguimiento) => {
      const seguidor = await Usuario.findById(seguimiento.seguidorId);
      const seguido = await Usuario.findById(seguimiento.seguidoId);

      return {
        ...seguimiento.toObject(),
        seguidorNombre: seguidor ? seguidor.nombre : null,
        seguidorApellido: seguidor ? seguidor.apellido : null,
        seguidoNombre: seguido ? seguido.nombre : null,
        seguidoApellido: seguido ? seguido.apellido : null,
      };
    }));

    res.status(200).json({ seguimientos: seguimientosConDetalles });
  } catch (error) {
    console.error('Error al obtener los seguidores y seguidos:', error);
    res.status(500).json({ message: 'Error al obtener seguidores y seguidos', error });
  }
};

// Eliminar un seguidor o dejar de seguir a alguien
export const eliminarSeguidor = async (req, res) => {
  try {
    const { seguidoId } = req.body;  // El ID del usuario que será dejado de seguir
    const seguidorId = req.user.id;  // El id del seguidor lo obtenemos de req.user.id

    // Verificar si existe el seguimiento
    const seguimientoExistente = await Seguimiento.findOne({ seguidorId, seguidoId });
    if (!seguimientoExistente) {
      return res.status(400).json({ message: 'No existe este seguimiento.' });
    }

    // Eliminar el seguimiento (dejar de seguir o eliminar al seguidor)
    await Seguimiento.deleteOne({ seguidorId, seguidoId });

    res.status(200).json({ message: 'Seguimiento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el seguidor:', error);
    res.status(500).json({ message: 'Error al eliminar el seguidor', error });
  }
};
