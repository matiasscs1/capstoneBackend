import Actividad from '../model/actividades.model.js';

export const creartActividad = async (req, res) => {
    try{
        const { titulo, descripcion, fechaInicio, fechaFin } = req.body;

        const nuevaActividad = new Actividad({
            titulo,
            descripcion,
            fechaInicio,
            fechaFin
        });

        await nuevaActividad.save();
        res.status(201).json({ message: "Actividad creada exitosamente." });

    }catch{
        console.error("Error en postActividad:", error);
        res.status(500).json({ message: "Error del servidor." });
    }
}

export const obtenerActividades = async (req, res) => {
    try{
        const actividades = await Actividad.find();
        res.status(200).json(actividades);
    }catch(error){
        console.error("Error en obtenerActividades:", error);
        res.status(500).json({ message: "Error del servidor." });
    }
}


export const actualizarActividad = async (req, res) => {
    try {
      const id = req.params.id;
      const { titulo, descripcion, fechaInicio, fechaFin } = req.body;
  
      const actividad = await Actividad.findOne({ id_actividad: id });
  
      if (!actividad) {
        return res.status(404).json({ message: 'Actividad no encontrada' });
      }
  
      actividad.titulo = titulo?.trim() || actividad.titulo;
      actividad.descripcion = descripcion?.trim() || actividad.descripcion;
      actividad.fechaInicio = fechaInicio ?? actividad.fechaInicio;
      actividad.fechaFin = fechaFin ?? actividad.fechaFin;
  
      await actividad.save();
  
      res.json({
        message: 'Actividad actualizada correctamente',
        actividad
      });
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const eliminarActividad = async (req, res) => {
    try{
        const id = req.params.id;
        const actividad = await Actividad.findOneAndDelete({ id_actividad: id });
        if (!actividad) {
            return res.status(404).json({ message: 'Actividad no encontrada' });
        }
        res.status(200).json({ message: 'Actividad eliminada exitosamente' });
    }catch(error){
        console.error('Error al eliminar actividad:', error);
        res.status(500).json({ message: 'Error al eliminar la actividad' });
    }
}

