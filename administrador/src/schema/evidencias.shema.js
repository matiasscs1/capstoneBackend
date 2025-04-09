import { z } from 'zod';

export const evidenciaSchemaZod = z.object({
  id_inscripcion: z.string().min(1, 'id_inscripcion es requerido'),

  descripcion: z.string().min(1, 'La descripción es requerida'),

  imagenes: z.array(
    z.object({
      url: z.string().url('Debe ser una URL válida'),
      tipo: z.enum(['imagen', 'video'])
    })
  ).min(1, 'Debe incluir al menos una imagen o video'),

  fechaSubida: z
    .preprocess(
      (val) => val ? new Date(val) : new Date(),
      z.date()
    )
});
