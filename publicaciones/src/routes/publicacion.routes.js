import { Router } from 'express';
import upload from '../middlewares/subirFotos.js';
import { authRequired } from '../middlewares/validateToken.js';
import { permitirAccion } from '../middlewares/permitirAccion.js';

import {
  crearPublicacion,
  listarPublicaciones,
  darLike,
  eliminarPublicacion,
  misPublicaciones,
  publicacionesPorUsuario,
  actualizarDescripcion
} from '../controller/publicaciones.controller.js';

import {
  crearComentario,
  listarComentarios,
  editarComentario,
  eliminarComentario
} from '../controller/comentario.controller.js';

const router = Router();

//
// PUBLICACIONES
//

// Crear una publicación (profesor o estudiante)
router.post(
  '/publicaciones',
  authRequired,
  permitirAccion(['profesor', 'estudiante']),
  upload.array('archivos'),
  crearPublicacion
);

// Listar todas las publicaciones (feed general)
router.get(
  '/publicaciones',
  authRequired,
  permitirAccion(['profesor', 'estudiante', 'padre']),
  listarPublicaciones
);

// Ver mis propias publicaciones
router.get(
  '/mis-publicaciones',
  authRequired,
  permitirAccion(['profesor', 'estudiante']),
  misPublicaciones
);

// Ver publicaciones de otro usuario (perfil público)
router.get(
  '/publicaciones/usuario/:autorId',
  authRequired,
  permitirAccion(['profesor', 'estudiante']),
  publicacionesPorUsuario
);

// Dar like a una publicación
router.post(
  '/publicaciones/:id_publicacion/like',
  authRequired,
  permitirAccion(['profesor', 'estudiante']),
  darLike
);

// Actualizar descripción de una publicación (solo autor)
router.put(
  '/publicaciones/:id_publicacion',
  authRequired,
  actualizarDescripcion
);

// Eliminar publicación (solo autor)
router.delete(
  '/publicaciones/:id_publicacion',
  authRequired,
  eliminarPublicacion
);


//
// COMENTARIOS
//

// Crear comentario en una publicación
router.post(
  '/publicaciones/:publicacionId/comentarios',
  authRequired,
  permitirAccion(['profesor', 'estudiante']),
  crearComentario
);

// Listar comentarios de una publicación
router.get(
  '/publicaciones/:publicacionId/comentarios',
  authRequired,
  permitirAccion(['profesor', 'estudiante', 'padre']),
  listarComentarios
);

// Editar comentario (solo autor)
router.put(
  '/comentarios/:id_comentario',
  authRequired,
  editarComentario
);

// Eliminar comentario (solo autor)
router.delete(
  '/comentarios/:id_comentario',
  authRequired,
  eliminarComentario
);

export default router;
