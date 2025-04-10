import FormData from 'form-data';
import verifyToken from '../middlewares/verifyToken.js';
import { forwardRequest } from '../utils/forwardRequest.js';
import fetch from 'node-fetch';
import fs from 'fs';
import multer from 'multer';
import { Router } from 'express';
import path from 'path';



const router = Router();


const upload = multer({ dest: 'temp/' });
const AUTH_BASE = 'http://localhost:5000';
const PUB_BASE = 'http://localhost:4000';

/* ---------------- AUTH SERVICE ---------------- */

router.post('/login', (req, res) =>
    forwardRequest({ req, res, method: 'POST', url: `${AUTH_BASE}/login`, sendBody: true })
  );
  
  router.post('/register-temp', (req, res) =>
    forwardRequest({ req, res, method: 'POST', url: `${AUTH_BASE}/register-temp`, sendBody: true })
  );
  
  router.post('/verify-email', (req, res) =>
    forwardRequest({ req, res, method: 'POST', url: `${AUTH_BASE}/verify-email`, sendBody: true })
  );
  router.post('/2fa', (req, res) => {
    forwardRequest({ req, res, method: 'POST', url: `${AUTH_BASE}/2fa`, sendBody: true })
  });
  
  
  
  
  router.post('/logout', verifyToken, (req, res) =>
    forwardRequest({ req, res, method: 'POST', url: `${AUTH_BASE}/logout` })
  );
  
  router.get('/profile', verifyToken, (req, res) =>
    forwardRequest({ req, res, method: 'GET', url: `${AUTH_BASE}/profile` })
  );
  
  router.get('/usuarios', verifyToken, (req, res) =>
    forwardRequest({ req, res, method: 'GET', url: `${AUTH_BASE}/usuarios` })
  );
  
  router.get('/usuario/:id_usuario', verifyToken, (req, res) =>
    forwardRequest({ req, res, method: 'GET', url: `${AUTH_BASE}/usuario/${req.params.id_usuario}` })
  );
  
  /* ---------------- PUBLICACIONES SERVICE ---------------- */
  
  // Crear publicación con archivos
  router.post('/publicaciones', verifyToken, upload.array('archivos'), async (req, res) => {
    try {
      const form = new FormData();
  
      form.append('descripcion', req.body.descripcion || '');
  
      for (const file of req.files) {
        form.append('archivos', fs.createReadStream(file.path), file.originalname);
      }
  
      const response = await fetch(`${PUB_BASE}/publicaciones`, {
        method: 'POST',
        headers: {
          Authorization: req.headers.authorization,
          ...form.getHeaders()
        },
        body: form
      });
  
      const data = await response.json();
  
      req.files.forEach(file => {
        fs.unlink(path.join(file.path), (err) => {
          if (err) {
            console.error(`Error eliminando archivo temporal: ${err.message}`);
          } else {
            console.log(`Archivo temporal eliminado: ${file.path}`);
          }
        });
      });
  
      res.status(response.status).json(data);
    } catch (err) {
      console.error('Error reenviando publicación:', err);
      res.status(500).json({ message: 'Error reenviando publicación' });
    }
  });
  
  router.get('/publicaciones', verifyToken, (req, res) =>
    forwardRequest({ req, res, method: 'GET', url: `${PUB_BASE}/publicaciones` })
  );
  
  router.get('/mis-publicaciones', verifyToken, (req, res) =>
    forwardRequest({ req, res, method: 'GET', url: `${PUB_BASE}/mis-publicaciones` })
  );
  
  router.get('/publicaciones/usuario/:autorId', verifyToken, (req, res) =>
    forwardRequest({ req, res, method: 'GET', url: `${PUB_BASE}/publicaciones/usuario/${req.params.autorId}` })
  );
  
  router.post('/publicaciones/:id_publicacion/like', verifyToken, (req, res) =>
    forwardRequest({ req, res, method: 'POST', url: `${PUB_BASE}/publicaciones/${req.params.id_publicacion}/like` })
  );
  
  router.put('/publicaciones/:id_publicacion', verifyToken, (req, res) =>
    forwardRequest({ req, res, method: 'PUT', url: `${PUB_BASE}/publicaciones/${req.params.id_publicacion}`, sendBody: true })
  );
  
  router.delete('/publicaciones/:id_publicacion', verifyToken, (req, res) =>
    forwardRequest({ req, res, method: 'DELETE', url: `${PUB_BASE}/publicaciones/${req.params.id_publicacion}` })
  );
  
  /* ---------------- COMENTARIOS ---------------- */
  
  router.post('/publicaciones/:publicacionId/comentarios', verifyToken, (req, res) =>
    forwardRequest({
      req,
      res,
      method: 'POST',
      url: `${PUB_BASE}/publicaciones/${req.params.publicacionId}/comentarios`,
      sendBody: true
    })
  );
  
  router.get('/publicaciones/:publicacionId/comentarios', verifyToken, (req, res) =>
    forwardRequest({
      req,
      res,
      method: 'GET',
      url: `${PUB_BASE}/publicaciones/${req.params.publicacionId}/comentarios`
    })
  );
  
  router.put('/comentarios/:id_comentario', verifyToken, (req, res) =>
    forwardRequest({
      req,
      res,
      method: 'PUT',
      url: `${PUB_BASE}/comentarios/${req.params.id_comentario}`,
      sendBody: true
    })
  );
  
  router.delete('/comentarios/:id_comentario', verifyToken, (req, res) =>
    forwardRequest({
      req,
      res,
      method: 'DELETE',
      url: `${PUB_BASE}/comentarios/${req.params.id_comentario}`
    })
  );

  export default router;