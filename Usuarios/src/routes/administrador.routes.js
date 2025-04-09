import { Router } from 'express';
const router = Router();
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
} from '../controller/usuario.controller.js';
router.get('/admin/ping', (req, res) => {
  res.json({ message: 'Microservicio de administrador funcionando 🎯' });
});

// Usuarios
router.get('/usuarios', authRequired, obtenerUsuarios);
router.get('/usuarios/:id_usuario', authRequired, obtenerUsuarioPorId);
router.put('/usuarios/:id_usuario', authRequired, actualizarUsuario);
router.delete('/usuarios/:id_usuario', authRequired, eliminarUsuario);

export default router;
