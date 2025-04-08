// src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import multer from 'multer';
import FormData from 'form-data';
import verifyToken from './middlewares/verifyToken.js';
import { forwardRequest } from './utils/forwardRequest.js';

dotenv.config();

const app = express();
const upload = multer({ dest: 'temp/' });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const AUTH_BASE = 'http://localhost:5000';
const PUB_BASE = 'http://localhost:4000';

/* ---------------- AUTH SERVICE ---------------- */

app.post('/login', (req, res) =>
  forwardRequest({ req, res, method: 'POST', url: `${AUTH_BASE}/login`, sendBody: true })
);

app.post('/register-temp', (req, res) =>
  forwardRequest({ req, res, method: 'POST', url: `${AUTH_BASE}/register-temp`, sendBody: true })
);

app.post('/verify-email', (req, res) =>
  forwardRequest({ req, res, method: 'POST', url: `${AUTH_BASE}/verify-email`, sendBody: true })
);

app.post('/2fa', (req, res) =>
  forwardRequest({ req, res, method: 'POST', url: `${AUTH_BASE}/2fa`, sendBody: true })
);

app.post('/logout', verifyToken, (req, res) =>
  forwardRequest({ req, res, method: 'POST', url: `${AUTH_BASE}/logout` })
);

app.get('/profile', verifyToken, (req, res) =>
  forwardRequest({ req, res, method: 'GET', url: `${AUTH_BASE}/profile` })
);

app.get('/usuarios', verifyToken, (req, res) =>
  forwardRequest({ req, res, method: 'GET', url: `${AUTH_BASE}/usuarios` })
);

app.get('/usuarios/:id_usuario', verifyToken, (req, res) =>
  forwardRequest({ req, res, method: 'GET', url: `${AUTH_BASE}/usuarios/${req.params.id_usuario}` })
);

/* ---------------- PUBLICACIONES SERVICE ---------------- */

// Crear publicación con archivos
app.post('/publicaciones', verifyToken, upload.array('archivos'), async (req, res) => {
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
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error reenviando publicación:', err);
    res.status(500).json({ message: 'Error reenviando publicación' });
  }
});

app.get('/publicaciones', verifyToken, (req, res) =>
  forwardRequest({ req, res, method: 'GET', url: `${PUB_BASE}/publicaciones` })
);

app.get('/mis-publicaciones', verifyToken, (req, res) =>
  forwardRequest({ req, res, method: 'GET', url: `${PUB_BASE}/mis-publicaciones` })
);

app.get('/publicaciones/usuario/:autorId', verifyToken, (req, res) =>
  forwardRequest({ req, res, method: 'GET', url: `${PUB_BASE}/publicaciones/usuario/${req.params.autorId}` })
);

app.post('/publicaciones/:id_publicacion/like', verifyToken, (req, res) =>
  forwardRequest({ req, res, method: 'POST', url: `${PUB_BASE}/publicaciones/${req.params.id_publicacion}/like` })
);

app.put('/publicaciones/:id_publicacion', verifyToken, (req, res) =>
  forwardRequest({ req, res, method: 'PUT', url: `${PUB_BASE}/publicaciones/${req.params.id_publicacion}`, sendBody: true })
);

app.delete('/publicaciones/:id_publicacion', verifyToken, (req, res) =>
  forwardRequest({ req, res, method: 'DELETE', url: `${PUB_BASE}/publicaciones/${req.params.id_publicacion}` })
);

/* ---------------- COMENTARIOS ---------------- */

app.post('/publicaciones/:publicacionId/comentarios', verifyToken, (req, res) =>
  forwardRequest({
    req,
    res,
    method: 'POST',
    url: `${PUB_BASE}/publicaciones/${req.params.publicacionId}/comentarios`,
    sendBody: true
  })
);

app.get('/publicaciones/:publicacionId/comentarios', verifyToken, (req, res) =>
  forwardRequest({
    req,
    res,
    method: 'GET',
    url: `${PUB_BASE}/publicaciones/${req.params.publicacionId}/comentarios`
  })
);

app.put('/comentarios/:id_comentario', verifyToken, (req, res) =>
  forwardRequest({
    req,
    res,
    method: 'PUT',
    url: `${PUB_BASE}/comentarios/${req.params.id_comentario}`,
    sendBody: true
  })
);

app.delete('/comentarios/:id_comentario', verifyToken, (req, res) =>
  forwardRequest({
    req,
    res,
    method: 'DELETE',
    url: `${PUB_BASE}/comentarios/${req.params.id_comentario}`
  })
);

/* ---------------- INICIAR ---------------- */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API Gateway corriendo en http://localhost:${PORT}`);
});
