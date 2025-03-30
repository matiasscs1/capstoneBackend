import { z } from 'zod';


export const registroUsuarioSchemaZod = z.object({
  nombre: z.string({
    required_error: 'El nombre es obligatorio',
  }).min(1, 'El nombre no puede estar vacío'),

  apellido: z.string({
    required_error: 'El apellido es obligatorio',
  }).min(1, 'El apellido no puede estar vacío'),

  correo: z.string({
    required_error: 'El correo es obligatorio',
  }).email('Formato de correo inválido'),

  contrasenia: z.string({
    required_error: 'La contraseña es obligatoria'
  })
    .min(8, 'Debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[@_#?¿&=¡!,+$*\-]/, 'Debe contener al menos un carácter especial permitido (@ _ # ? ¿ & = ¡ ! , + $ * -)'),

  rol: z.enum(['administrador', 'usuario', 'profesor', 'representante'], {
    required_error: 'El rol es obligatorio',
    invalid_type_error: 'Rol inválido',
  }),

  fecha_nacimiento: z.string({
    required_error: 'La fecha de nacimiento es obligatoria',
  }).refine((val) => !isNaN(Date.parse(val)), {
    message: 'Formato de fecha inválido',
  })
});




export const loginSchemaZod = z.object({
  correo: z.string({
    required_error: 'El correo es obligatorio',
  }).email('Formato de correo inválido'),

  contrasenia: z.string({
    required_error: 'La contraseña es obligatoria',
  }).min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

