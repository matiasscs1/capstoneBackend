import { z } from 'zod';

export const recompensaSchemaZod = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().trim().min(1, 'La descripción es obligatoria'),
  puntosRequeridos: z.number().int().positive('Debe ser un número positivo'),
  imagenes: z.array(
    z.object({
      url: z.string().url('Debe ser una URL válida'),
      tipo: z.literal('imagen')
    })
  ).optional(),
  cantidadDisponible: z.number().int().nonnegative().default(0),
  activa: z.boolean().default(true)
});

export const  recompensaUpdateSchemaZod = z.object({
  id_recompensa: z.string().trim().min(1, 'El ID de la recompensa es obligatorio').uuid('El ID de la recompensa debe ser un UUID válido'),
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').optional(),
  descripcion: z.string().trim().min(1, 'La descripción es obligatoria').optional(),
  puntosRequeridos: z.number().int().positive('Debe ser un número positivo').optional(),
  imagenes: z.array(
    z.object({
      url: z.string().url('Debe ser una URL válida'),
      tipo: z.literal('imagen')
    })
  ).optional(),
  cantidadDisponible: z.number().int().nonnegative().default(0).optional(),
  activa: z.boolean().default(true).optional()
});