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
router.post('/register-temp', upload.array('files'), validateSchema(registroUsuarioSchemaZod), registerTemp);
router.post('/verify-email', verificarCorreo);
router.post('/2fa', verificar2FA);

// Auth
/*router.post('/login', (req, res, next) => {
  console.log('📨 Login llegó al authService');
  next();
}, login);*/

router.post('/login', validateSchema(loginSchemaZod), login);
router.post('/logout', logout);
router.get('/profile', authRequired, profile);

// Usuarios
router.get('/usuarios', authRequired, obtenerUsuarios);
router.get('/usuarios/:id_usuario', authRequired, obtenerUsuarioPorId);
router.put('/usuarios/:id_usuario', authRequired, actualizarUsuario);
router.delete('/usuarios/:id_usuario', authRequired, eliminarUsuario);

export default router;
