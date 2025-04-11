import { z } from 'zod';

// Esquema de validación con Zod
export const seguimientoSchema = z.object({
  seguidorId: z.string().uuid("El seguidorId debe ser un UUID válido"),  // Validar que sea un UUID
  seguidoId: z.string().uuid("El seguidoId debe ser un UUID válido"),    // Validar que sea un UUID
  fecha: z.date().default(() => new Date()),  // Fecha actual por defecto
});
