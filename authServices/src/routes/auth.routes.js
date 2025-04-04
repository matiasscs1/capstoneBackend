import { Router } from 'express';

import {
  registerTemp,
  login,
  logout,
  profile
} from '../controller/auth.controller.js';

import {
  verificarCorreo,
  verificar2FA
} from '../controller/verificacion.controller.js';

import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { loginSchemaZod, registroUsuarioSchemaZod } from '../schemas/auth.shema.js';

import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
} from '../controller/usuario.controller.js';

import upload from '../middlewares/subirFotos.js';

const router = Router();

// Verificación por correo
router.post('/api/register-temp', upload.array('files'), validateSchema(registroUsuarioSchemaZod), registerTemp);
router.post('/api/verify-email', verificarCorreo);
router.post('/api/2fa', verificar2FA);

// Auth
router.post('/api/login', validateSchema(loginSchemaZod), login);
router.post('/api/logout', logout);
router.get('/api/profile', authRequired, profile);

// Usuarios
router.get('/api/usuarios', authRequired, obtenerUsuarios);
router.get('/api/usuarios/:id_usuario', authRequired, obtenerUsuarioPorId);
router.put('/api/usuarios/:id_usuario', authRequired, actualizarUsuario);
router.delete('/api/usuarios/:id_usuario', authRequired, eliminarUsuario);

export default router;
