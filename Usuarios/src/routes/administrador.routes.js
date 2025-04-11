import express from 'express';
import { validateSchema } from '../middlewares/validateSchema.js';  // Middleware para la validación de Zod
import { 
    creartActividad,
    obtenerActividades,
    actualizarActividad,
    eliminarActividad 
} from './controllers/actividades.controller.js';
import { 
    verEvidencia,
    modificarEvidencia,
    eliminarEvidencia 
} from './controllers/evidencia.controller.js';
import { 
    crearPerfil, 
    getPerfilPorId, 
    getTodosPerfiles, 
    updatePerfil, 
    deletePerfil 
} from './controllers/perfil.controller.js';
import { 
    crearMision, 
    verMision, 
    verMisiones, 
    editarMision, 
    eliminarMision 
} from './controllers/mision.controller.js';
import { 
    obtenerUsuarios, 
    obtenerUsuarioPorId, 
    actualizarUsuario, 
    eliminarUsuario 
} from './controllers/usuario.controller.js';
import { 
    crearRecompensa, 
    verRecompensas, 
    verRecompensaPorId, 
    actualizarRecompensa, 
    eliminarRecompensa 
} from './controllers/recompensas.controller.js';
import { 
    crearInsignia, 
    obtenerInsignias, 
    obtenerInsigniaPorId, 
    actualizarInsignia, 
    eliminarInsignia 
} from './controllers/insignias.controller.js';
import { 
    crearSeguimiento,
    contarSeguidoresYSeguidos,
    obtenerSeguidorYSeguido,
    eliminarSeguidor
} from './controllers/seguimientos.controller.js';
import { authRequired } from './middleware/validateToken.js';

// **Schemas Zod**
import { 
    actividadSchemaZod 
} from './shemas/actividades.shema.js';
import { 
    evidenciaSchemaZod 
} from './shemas/evidencias.shema.js';
import { 
    insigniaSchemaZod, 
    insigniaUpdateSchemaZod 
} from './shemas/insignia.shema.js';
import { 
    recompensaSchemaZod, 
    recompensaUpdateSchemaZod 
} from './shemas/recompensa.shema.js';
import { 
    seguimientoSchema 
} from './shemas/seguimientos.shema.js';

const router = express.Router();

// **Rutas de Actividades**
router.post('/actividad', authRequired, validateSchema(actividadSchemaZod), creartActividad);
router.get('/actividades', authRequired, obtenerActividades);
router.put('/actividad/:id', authRequired, validateSchema(actividadSchemaZod), actualizarActividad);
router.delete('/actividad/:id', authRequired, eliminarActividad);

// **Rutas de Evidencias**
router.post('/evidencia', authRequired, validateSchema(evidenciaSchemaZod), verEvidencia);
router.put('/evidencia/:id', authRequired, validateSchema(evidenciaSchemaZod), modificarEvidencia);
router.delete('/evidencia/:id', authRequired, eliminarEvidencia);

// **Rutas de Perfil**
router.post('/perfil', authRequired, crearPerfil);
router.get('/perfil', authRequired, getPerfilPorId);
router.get('/perfiles', authRequired, getTodosPerfiles);
router.put('/perfil', authRequired, updatePerfil);
router.delete('/perfil', authRequired, deletePerfil);

// **Rutas de Misiones**
router.post('/mision', authRequired, validateSchema(actividadSchemaZod), crearMision);
router.get('/mision/:id', authRequired, verMision);
router.get('/misiones', authRequired, verMisiones);
router.put('/mision/:id', authRequired, validateSchema(actividadSchemaZod), editarMision);
router.delete('/mision/:id', authRequired, eliminarMision);

// **Rutas de Usuarios**
router.get('/usuarios', authRequired, obtenerUsuarios);
router.get('/usuario/:id', authRequired, obtenerUsuarioPorId);
router.put('/usuario/:id', authRequired, validateSchema(actividadSchemaZod), actualizarUsuario);
router.delete('/usuario/:id', authRequired, eliminarUsuario);

// **Rutas de Recompensas**
router.post('/recompensa', authRequired, validateSchema(recompensaSchemaZod), crearRecompensa);
router.get('/recompensas', authRequired, verRecompensas);
router.get('/recompensa/:id', authRequired, verRecompensaPorId);
router.put('/recompensa/:id', authRequired, validateSchema(recompensaUpdateSchemaZod), actualizarRecompensa);
router.delete('/recompensa/:id', authRequired, eliminarRecompensa);

// **Rutas de Insignias**
router.post('/insignia', authRequired, validateSchema(insigniaSchemaZod), crearInsignia);
router.get('/insignias', authRequired, obtenerInsignias);
router.get('/insignia/:id', authRequired, obtenerInsigniaPorId);
router.put('/insignia/:id', authRequired, validateSchema(insigniaUpdateSchemaZod), actualizarInsignia);
router.delete('/insignia/:id', authRequired, eliminarInsignia);

// **Rutas de Seguimientos**
router.post('/seguimiento', authRequired, validateSchema(seguimientoSchema), crearSeguimiento);  // Usamos el controlador de crearSeguimiento
router.get('/seguidores-contar', authRequired, contarSeguidoresYSeguidos);  // Contar seguidores y seguidos
router.get('/seguimientos', authRequired, obtenerSeguidorYSeguido);  // Obtener los detalles de los seguidores y seguidos
router.delete('/seguimiento', authRequired, eliminarSeguidor);  // Eliminar un seguimiento

export default router;
