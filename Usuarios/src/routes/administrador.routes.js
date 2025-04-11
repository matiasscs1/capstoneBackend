import express from 'express';
import { validateSchema } from '../middlewares/validateSchema.js';
import { authRequired } from '../middlewares/validateToken.js';
import upload  from '../middlewares/subirFotos.js'; 

// Controladores
import { creartActividad, obtenerActividades, actualizarActividad, eliminarActividad, obtenerActividadPorId } from '../controllers/actividades.controller.js';
import { verEvidencia, modificarEvidencia, eliminarEvidencia } from '../controllers/evidencia.controller.js';
import { crearPerfil, getPerfilPorId, getTodosPerfiles, updatePerfil, deletePerfil } from '../controllers/perfil.controller.js';
import { crearMision, verMision, verMisiones, editarMision, eliminarMision } from '../controllers/mision.controller.js';
import { obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario } from '../controllers/usuario.controller.js';
import { crearRecompensa, verRecompensas, verRecompensaPorId, actualizarRecompensa, eliminarRecompensa } from '../controllers/recompensas.controller.js';
import { crearInsignia, obtenerInsignias, obtenerInsigniaPorId, actualizarInsignia, eliminarInsignia } from '../controllers/insignias.controller.js';
import { crearSeguimiento, contarSeguidoresYSeguidos, obtenerSeguidorYSeguido, eliminarSeguidor } from '../controllers/seguimientos.controller.js';

// Schemas Zod
import { actividadSchemaZod } from '../schemas/actividades.shema.js';
//import { evidenciaSchemaZod } from './shemas/evidencias.shema.js';
import { insigniaSchemaZod, insigniaUpdateSchemaZod } from '../schemas/insignia.shema.js';
import { recompensaSchemaZod, recompensaUpdateSchemaZod } from '../schemas/recompensa.shema.js';
import { seguimientoSchema } from '../schemas/seguimientos.shema.js';

const router = express.Router();

/* ----------------------- ACTIVIDADES ----------------------- */
router.post('/actividad', authRequired, validateSchema(actividadSchemaZod), creartActividad);
router.get('/actividades', authRequired, obtenerActividades);
router.get('/actividad/:id', authRequired, obtenerActividadPorId);

router.put('/actividad/:id', authRequired, actualizarActividad);
router.delete('/actividad/:id', authRequired, eliminarActividad);

/* ----------------------- EVIDENCIAS ----------------------- */
router.get('/evidencias', authRequired, verEvidencia);  // Es GET, no POST
router.put('/evidencia/:id', authRequired, modificarEvidencia); // 
router.delete('/evidencia/:id', authRequired, eliminarEvidencia);

/* ----------------------- PERFILES ----------------------- */
router.post('/perfil', authRequired, upload.array('foto_portada'), crearPerfil); 
router.get('/perfil', authRequired, getPerfilPorId);
router.get('/perfiles', authRequired, getTodosPerfiles);
router.put('/perfil', authRequired, upload.array('foto_portada'), updatePerfil);
router.delete('/perfil', authRequired, deletePerfil);

/* ----------------------- MISIONES ----------------------- */
router.post('/mision', authRequired, crearMision);
router.get('/mision/:id_mision', authRequired, verMision);
router.get('/misiones', authRequired, verMisiones);
router.put('/mision/:id_mision', authRequired, editarMision);
router.delete('/mision/:id_mision', authRequired, eliminarMision);

/* ----------------------- USUARIOS ----------------------- */
router.get('/usuarios', authRequired, obtenerUsuarios);
router.get('/usuario/:id_usuario', authRequired, obtenerUsuarioPorId);
router.put('/usuario/:id_usuario', authRequired, actualizarUsuario);
router.delete('/usuario/:id_usuario', authRequired, eliminarUsuario);

/* ----------------------- RECOMPENSAS ----------------------- */
router.post('/recompensa', authRequired, validateSchema(recompensaSchemaZod), crearRecompensa);
router.get('/recompensas', authRequired, verRecompensas);
router.get('/recompensa/:id_recompensa', authRequired, verRecompensaPorId);
router.put('/recompensa/:id_recompensa', authRequired, validateSchema(recompensaUpdateSchemaZod), actualizarRecompensa);
router.delete('/recompensa/:id_recompensa', authRequired, eliminarRecompensa);

/* ----------------------- INSIGNIAS ----------------------- */
router.post('/insignia', authRequired, validateSchema(insigniaSchemaZod), crearInsignia);
router.get('/insignias', authRequired, obtenerInsignias);
router.get('/insignia/:id', authRequired, obtenerInsigniaPorId);
router.put('/insignia/:id', authRequired, validateSchema(insigniaUpdateSchemaZod), actualizarInsignia);
router.delete('/insignia/:id', authRequired, eliminarInsignia);

/* ----------------------- SEGUIMIENTOS ----------------------- */
router.post('/seguimiento', authRequired, validateSchema(seguimientoSchema), crearSeguimiento);
router.get('/seguidores-contar', authRequired, contarSeguidoresYSeguidos);
router.get('/seguimientos', authRequired, obtenerSeguidorYSeguido);
router.delete('/seguimiento', authRequired, eliminarSeguidor);

export default router;
