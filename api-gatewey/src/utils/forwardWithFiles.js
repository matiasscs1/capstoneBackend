import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

/**
 * Reenvía una solicitud POST con archivos usando multipart/form-data.
 */
export async function forwardWithFiles(req, res, targetUrl) {
  try {
    const form = new FormData();
    if (req.body.descripcion) {
      form.append('descripcion', req.body.descripcion);
    }

    for (const file of req.files) {
      form.append('archivos', fs.createReadStream(file.path), file.originalname);
    }

    const response = await fetch(targetUrl, {
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
    console.error(' Error reenviando archivos:', err);
    res.status(500).json({ message: 'Error reenviando publicación' });
  }
}
