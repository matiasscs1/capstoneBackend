import Recompensa from '../models/recompensa.model.js'; // Asegúrate de importar el modelo correctamente

export const crearRecompensa = async (req, res) => {
    try {
        const { nombre, descripcion, puntosRequeridos, cantidadDisponible, activa } = req.body;

        // Validación básica
        if (!nombre || !descripcion || !puntosRequeridos) {
            return res.status(400).json({ message: 'Faltan datos requeridos para crear la recompensa.' });
        }

        // Crear una nueva recompensa
        const nuevaRecompensa = new Recompensa({
            nombre,
            descripcion,
            puntosRequeridos,
            cantidadDisponible,
            activa
        });

        // Guardar la recompensa en la base de datos
        const recompensaGuardada = await nuevaRecompensa.save();

        // Responder con la recompensa creada
        res.status(201).json({ message: 'Recompensa creada exitosamente', recompensa: recompensaGuardada });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la recompensa', error: error.message });
    }
};

export const verRecompensas = async (req, res) => {
    try {
        // Obtener todas las recompensas de la base de datos
        const recompensas = await Recompensa.find();

        // Si no hay recompensas, devolver mensaje
        if (recompensas.length === 0) {
            return res.status(404).json({ message: 'No hay recompensas disponibles.' });
        }

        // Responder con la lista de recompensas
        res.status(200).json({ recompensas });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las recompensas', error: error.message });
    }
};


export const verRecompensaPorId = async (req, res) => {
    try {
        const { id_recompensa } = req.params;  // Obtiene el id de la recompensa desde los parámetros de la URL

        // Buscar la recompensa por ID
        const recompensa = await Recompensa.findOne({ id_recompensa });

        // Si no se encuentra la recompensa, devolver un error 404
        if (!recompensa) {
            return res.status(404).json({ message: 'Recompensa no encontrada' });
        }

        // Responder con la recompensa encontrada
        res.status(200).json({ recompensa });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la recompensa', error: error.message });
    }
};


export const actualizarRecompensa = async (req, res) => {
    try {
        const { id_recompensa } = req.params;  // Obtiene el id de la recompensa desde los parámetros de la URL
        const { nombre, descripcion, puntosRequeridos, cantidadDisponible, activa } = req.body; // Datos a actualizar

        // Buscar y actualizar la recompensa en la base de datos por id_recompensa
        const recompensaActualizada = await Recompensa.findOneAndUpdate(
            { id_recompensa },
            { nombre, descripcion, puntosRequeridos, cantidadDisponible, activa },
            { new: true }  // Devuelve el documento actualizado
        );

        // Si no se encuentra la recompensa, devolver un error 404
        if (!recompensaActualizada) {
            return res.status(404).json({ message: 'Recompensa no encontrada' });
        }

        // Responder con la recompensa actualizada
        res.status(200).json({ message: 'Recompensa actualizada exitosamente', recompensa: recompensaActualizada });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la recompensa', error: error.message });
    }
};

export const eliminarRecompensa = async (req, res) => {
    try {
        const { id_recompensa } = req.params;  // Obtiene el id de la recompensa desde los parámetros de la URL

        // Eliminar la recompensa por id_recompensa
        const recompensaEliminada = await Recompensa.findOneAndDelete({ id_recompensa });

        // Si no se encuentra la recompensa, devolver un error 404
        if (!recompensaEliminada) {
            return res.status(404).json({ message: 'Recompensa no encontrada' });
        }

        // Responder con éxito
        res.status(200).json({ message: 'Recompensa eliminada exitosamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la recompensa', error: error.message });
    }
};
