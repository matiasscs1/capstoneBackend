import Evidencia from '../models/evidencia.model.js';

export const verEvidencia = async (req, res) => {
  try {

    const evidencia = await Evidencia.find();

    if (!evidencias) {
      return res.status(404).json({ message: 'Evidencia no encontrada' });
    }

    res.json({
      id_inscripcion: evidencia.id_inscripcion,
      imagenes: evidencia.imagenes, 
      descripcion: evidencia.descripcion,
      fechaSubida: evidencia.fechaSubida
    });
  } catch (err) {
    console.error('Error al obtener evidencia:', err);
    res.status(500).json({ message: 'Error al obtener la evidencia' });
  }
};

export const modificarEvidencia = async (req, res) => {
    try{
        const id = req.params.id;

        const {tipo} = req.body;

        const evidencias = await Evidencia.findOne({ id_evidencia: id });

        if (!evidencia) {
            return res.status(404).json({ message: 'Evidencia no encontrada' });
          }

        evidencias.tipo = tipo?.trim() || evidencias.tipo;

        await evidencia.save();


    }catch(error){
        console.error("Error en modificarEvidencia:", error);
        res.status(500).json({ message: "Error del servidor." });
    }
}

export const eliminarEvidencia = async (req, res) => {
    const id = req.params.id;
    try {
        const evidencia = await Evidencia.findOneAndDelete({ id_evidencia: id });
        if (!evidencia) {
            return res.status(404).json({ message: 'Evidencia no encontrada' });
        }
        res.status(200).json({ message: 'Evidencia eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar evidencia:', error);
        res.status(500).json({ message: 'Error al eliminar la evidencia' });
    }
} 
