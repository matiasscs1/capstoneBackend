import {z} from "zod";

export const insigniaSchemaZod = z.object({
    nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
    descripcion: z.string().trim().min(1, 'La descripción es obligatoria'),
    imagenes: z.array(
        z.object({
        url: z.string().url('Debe ser una URL válida'),
        tipo: z.literal('imagen')
        })
    ).optional(),
    activa: z.boolean().default(true)
    });

export const insigniaUpdateSchemaZod = z.object({
    id_insignia: z.string().trim().min(1, 'El ID de la insignia es obligatorio').uuid('El ID de la insignia debe ser un UUID válido'),
    nombre: z.string().trim().min(1, 'El nombre es obligatorio').optional(),
    descripcion: z.string().trim().min(1, 'La descripción es obligatoria').optional(),
    imagenes: z.array(
        z.object({
        url: z.string().url('Debe ser una URL válida'),
        tipo: z.literal('imagen')
        })
    ).optional(),
    activa: z.boolean().default(true).optional()
});