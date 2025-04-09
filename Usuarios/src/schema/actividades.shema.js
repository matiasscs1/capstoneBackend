import { z } from 'zod';

export const actividadSchemaZod = z.object({
  titulo: z.string().trim().min(1, 'El título es obligatorio'),
  descripcion: z.string().trim().min(1, 'La descripción es obligatoria'),
  puntosOtorgados: z.number().int().positive('Debe ser un número positivo'),
  fechaInicio: z.preprocess((val) => new Date(val), z.date({
    required_error: 'La fecha de inicio es obligatoria'
  })),
  fechaFin: z.preprocess((val) => new Date(val), z.date({
    required_error: 'La fecha de fin es obligatoria'
  })),
  activa: z.boolean().optional().default(true)
});
