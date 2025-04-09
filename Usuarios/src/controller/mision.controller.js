import Mision from '../model/mision.model.js'; // Importa tu modelo Misión

export const crearMision = async (req, res) => {
    try {
        const { titulo, descripcion, puntos, fechaInicio, fechaFin, estado } = req.body;

        // Verificar que todos los datos necesarios estén presentes
        if (!titulo || !descripcion || !puntos || !fechaInicio || !fechaFin) {
            return res.status(400).json({ message: 'Faltan datos necesarios para crear la misión.' });
        }

        // Crear una nueva misión
        const nuevaMision = new Mision({
            titulo,
            descripcion,
            puntos,
            fechaInicio,
            fechaFin,
            estado
        });

        // Guardar la misión en la base de datos
        const misionGuardada = await nuevaMision.save();

        // Responder con la misión guardada
        res.status(201).json({ message: 'Misión creada exitosamente', mision: misionGuardada });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la misión', error: error.message });
    }
};

import Mision from '../models/Mision'; // Importa tu modelo Misión

export const verMision = async (req, res) => {
    try {
        const { id_mision } = req.params;  // Obtiene el id de la misión desde los parámetros de la URL

        // Buscar la misión en la base de datos por id_mision
        const mision = await Mision.findOne({ id_mision });

        // Si no se encuentra la misión, devolver un error 404
        if (!mision) {
            return res.status(404).json({ message: 'Misión no encontrada' });
        }

        // Devolver la misión encontrada
        res.status(200).json({ mision });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la misión', error: error.message });
    }
};


export const verMisiones = async (req, res) => {
    try{
        // Obtener todas las misiones de la base de datos
        const misiones = await Mision.find();

        // Devolver las misiones encontradas
        res.status(200).json({ misiones });

    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las misiones', error: error.message });
    }
}
export const editarMision = async (req, res) => {
    try {
        const { id_mision } = req.params;  // Obtiene el id de la misión desde los parámetros de la URL
        const { titulo, descripcion, puntos, fechaInicio, fechaFin, estado } = req.body; // Obtiene los datos a actualizar

        // Buscar y actualizar la misión en la base de datos por id_mision
        const misionActualizada = await Mision.findOneAndUpdate(
            { id_mision },
            { titulo, descripcion, puntos, fechaInicio, fechaFin, estado },
            { new: true }  // Devuelve el documento actualizado
        );

        // Si no se encuentra la misión, devolver un error 404
        if (!misionActualizada) {
            return res.status(404).json({ message: 'Misión no encontrada' });
        }

        // Devolver la misión actualizada
        res.status(200).json({ message: 'Misión actualizada exitosamente', mision: misionActualizada });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la misión', error: error.message });
    }
}

export const eliminarMision = async (req, res) => {
    try {
        const { id_mision } = req.params;  // Obtiene el id de la misión desde los parámetros de la URL

        // Buscar y eliminar la misión en la base de datos por id_mision
        const misionEliminada = await Mision.findOneAndDelete({ id_mision });

        // Si no se encuentra la misión, devolver un error 404
        if (!misionEliminada) {
            return res.status(404).json({ message: 'Misión no encontrada' });
        }

        // Devolver un mensaje de éxito
        res.status(200).json({ message: 'Misión eliminada exitosamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la misión', error: error.message });
    }
}